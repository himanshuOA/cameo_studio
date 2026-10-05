# run-all.ps1
# ------------------------------------------------------------------
# Finds the Google Drive downloads, unzips them, resizes every photo
# and puts it in the right src\photos\<category> folder.
#
# Run it from the project folder (where package.json is):
#
#     .\run-all.ps1
#
# It looks in your Downloads folder by default. To point somewhere else:
#
#     .\run-all.ps1 -Downloads "D:\cameo photos"
#
# Zips and already-extracted folders both work. Drive's long filenames
# ("- Wedding Shoot-20261005T173547Z-1-001.zip") are handled, so there
# is nothing to rename. Run it again any time — each category is
# rebuilt from scratch, so nothing gets duplicated.
# ------------------------------------------------------------------

param(
  [string]$Downloads = "$env:USERPROFILE\Downloads",
  [int]$LongEdge = 1600,
  [int]$Quality = 78,
  [switch]$KeepExtracted
)

# Drive folder name (lowercase)  ->  category slug in src\data\site.js
$map = @{
  "wedding shoot"       = "wedding"
  "pre wedding shoot"   = "pre-wedding"
  "post wedding shoot"  = "post-wedding"
  "maternity shoot"     = "maternity"
  "new born baby shoot" = "baby"
  "pre birthday shoot"  = "pre-birthday"
  "birthday event"      = "birthday"
  "family function"     = "family-function"
  "corporate shoot"     = "corporate"
  "interio shoot"       = "interior"
  "portfolio shoot"     = "portfolio"
  "food shoot"          = "food"
  "product shoot"       = "product"
  "clothing shoot"      = "clothing"
}

# "- Wedding Shoot-20261005T173547Z-1-001" -> "wedding shoot"
function Get-DriveName([string]$raw) {
  $n = $raw -replace '-\d{8}T\d{6}Z-\d+-\d+$', ''
  $n = $n.TrimStart('-', ' ').Trim()
  return ($n -replace '\s+', ' ').ToLower()
}

if (-not (Test-Path $Downloads)) {
  Write-Host "Downloads folder not found: $Downloads" -ForegroundColor Red
  exit 1
}
if (-not (Test-Path (Join-Path $PSScriptRoot "prepare-photos.ps1"))) {
  Write-Host "prepare-photos.ps1 must sit next to this script." -ForegroundColor Red
  exit 1
}

Write-Host "Looking in $Downloads" -ForegroundColor Cyan

# Collect every zip and folder that matches a known category.
# A big Drive folder arrives as several zips, so group them by slug.
$groups = @{}

foreach ($f in Get-ChildItem -Path $Downloads -Filter *.zip -File) {
  $slug = $map[(Get-DriveName $f.BaseName)]
  if ($slug) { if (-not $groups[$slug]) { $groups[$slug] = @() }; $groups[$slug] += $f }
}
foreach ($d in Get-ChildItem -Path $Downloads -Directory) {
  $slug = $map[(Get-DriveName $d.Name)]
  if ($slug) { if (-not $groups[$slug]) { $groups[$slug] = @() }; $groups[$slug] += $d }
}

if ($groups.Count -eq 0) {
  Write-Host "Nothing recognised in $Downloads." -ForegroundColor Yellow
  Write-Host "Expected names like 'Wedding Shoot' or '- Wedding Shoot-2026...-1-001.zip'."
  exit 1
}

Write-Host "Found $($groups.Count) categories to process." -ForegroundColor Cyan

$stageRoot = Join-Path $env:TEMP "cameo-stage"

foreach ($slug in $groups.Keys | Sort-Object) {
  $sources = $groups[$slug]
  $dest = Join-Path $PSScriptRoot "src\photos\$slug"

  Write-Host ""
  Write-Host "=== $slug ($($sources.Count) source$(if ($sources.Count -ne 1) {'s'})) ===" -ForegroundColor Cyan

  if (-not (Test-Path $dest)) {
    Write-Host "  no folder src\photos\$slug - skipping" -ForegroundColor Yellow
    continue
  }

  # Rebuild from scratch so a second run does not pile up duplicates
  Get-ChildItem $dest -Filter *.jpg -File -ErrorAction SilentlyContinue | Remove-Item -Force

  # One folder and nothing to unzip? Use it where it is.
  $from = $null
  $stage = $null

  if ($sources.Count -eq 1 -and $sources[0].PSIsContainer) {
    $from = $sources[0].FullName
  }
  else {
    $stage = Join-Path $stageRoot $slug
    if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
    New-Item -ItemType Directory -Path $stage -Force | Out-Null

    foreach ($s in $sources) {
      if ($s.PSIsContainer) {
        Write-Host "  copying $($s.Name)..."
        Copy-Item $s.FullName -Destination $stage -Recurse -Force
      }
      else {
        Write-Host "  unzipping $($s.Name)  ($([int]($s.Length/1MB)) MB)..."
        try {
          Expand-Archive -Path $s.FullName -DestinationPath $stage -Force -ErrorAction Stop
        }
        catch {
          Write-Host "  could not unzip $($s.Name): $_" -ForegroundColor Yellow
        }
      }
    }
    $from = $stage
  }

  & (Join-Path $PSScriptRoot "prepare-photos.ps1") -From $from -Category $slug -LongEdge $LongEdge -Quality $Quality

  if ($stage -and -not $KeepExtracted) {
    Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
  }
}

if (-not $KeepExtracted -and (Test-Path $stageRoot)) {
  Remove-Item $stageRoot -Recurse -Force -ErrorAction SilentlyContinue
}

# What is still empty, so you know what to ask the client for
Write-Host ""
Write-Host "Categories still without photos:" -ForegroundColor Cyan
$empty = @()
foreach ($dir in Get-ChildItem (Join-Path $PSScriptRoot "src\photos") -Directory) {
  if (-not (Get-ChildItem $dir.FullName -Filter *.jpg -File -ErrorAction SilentlyContinue)) {
    $empty += $dir.Name
  }
}
if ($empty.Count -eq 0) { Write-Host "  none - every category has photos." -ForegroundColor Green }
else { Write-Host "  $($empty -join ', ')" -ForegroundColor Yellow }

Write-Host ""
Write-Host "Done. Run npm run dev to see the site." -ForegroundColor Green
