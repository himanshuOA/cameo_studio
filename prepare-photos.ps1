# prepare-photos.ps1
# ------------------------------------------------------------------
# Resizes photos and copies them straight into the website's
# src/photos/<category> folder. Nothing to install - uses the .NET
# imaging that ships with Windows.
#
# USAGE (run from the project folder, where package.json is):
#
#   .\prepare-photos.ps1 -From "C:\Users\himan\Downloads\Wedding Shoot" -Category wedding
#   .\prepare-photos.ps1 -From "C:\Users\himan\Downloads\Maternity Shoot" -Category maternity
#
# Optional:
#   -Max 20        only the first 20 photos
#   -LongEdge 2000 bigger images (default 1600 keeps the site light)
#   -Quality 85    higher quality, bigger files (default 78)
# ------------------------------------------------------------------

param(
  [Parameter(Mandatory = $true)][string]$From,
  [Parameter(Mandatory = $true)][string]$Category,
  [int]$Max = 0,
  [int]$LongEdge = 1600,
  [int]$Quality = 78
)

Add-Type -AssemblyName System.Drawing

$dest = Join-Path $PSScriptRoot "src\photos\$Category"

if (-not (Test-Path $From)) { Write-Host "Source folder not found: $From" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $dest)) { Write-Host "No such category folder: $dest" -ForegroundColor Red; exit 1 }

$files = Get-ChildItem -Path $From -Include *.jpg, *.jpeg, *.png -Recurse -File | Sort-Object Name
if ($Max -gt 0) { $files = $files | Select-Object -First $Max }
if ($files.Count -eq 0) { Write-Host "No photos found in $From" -ForegroundColor Yellow; exit 1 }

Write-Host "Processing $($files.Count) photos into src\photos\$Category" -ForegroundColor Cyan

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

$i = 0
foreach ($file in $files) {
  $i++
  try {
    $img = [System.Drawing.Image]::FromFile($file.FullName)

    $scale = [Math]::Min(1.0, $LongEdge / [Math]::Max($img.Width, $img.Height))
    $w = [int]($img.Width * $scale)
    $h = [int]($img.Height * $scale)

    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)

    # 001.jpg, 002.jpg ... so the order on the site matches the order here
    $out = Join-Path $dest ("{0:D3}.jpg" -f $i)
    $bmp.Save($out, $codec, $params)

    $g.Dispose(); $bmp.Dispose(); $img.Dispose()

    if ($i % 10 -eq 0) { Write-Host "  $i / $($files.Count)..." }
  }
  catch {
    Write-Host "  skipped $($file.Name): $_" -ForegroundColor Yellow
  }
}

$total = (Get-ChildItem $dest -Filter *.jpg | Measure-Object -Property Length -Sum).Sum
$avg = if ($i -gt 0) { [int]($total / $i / 1KB) } else { 0 }

Write-Host ""
Write-Host "Done. src\photos\$Category is now $([int]($total/1MB)) MB - $i photos, about $avg KB each." -ForegroundColor Green

if ($avg -gt 400) {
  Write-Host "That is on the heavy side. Re-run with -Quality 70 if the site feels slow." -ForegroundColor Yellow
}

# Whole-site total, so you can see where you stand
$all = (Get-ChildItem (Join-Path $PSScriptRoot "src\photos") -Filter *.jpg -Recurse | Measure-Object -Property Length -Sum).Sum
Write-Host "All categories together: $([int]($all/1MB)) MB. Keep this under 60 MB." -ForegroundColor Cyan
Write-Host "Run npm run dev to see them on the site."
