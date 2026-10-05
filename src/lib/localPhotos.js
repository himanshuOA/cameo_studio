// ---------------------------------------------------------------
// Photos you drop into src/photos/<category-slug>/ are picked up
// automatically — no code change needed anywhere.
//
//   src/photos/wedding/001.jpg       -> Wedding Stories gallery
//   src/photos/maternity/001.jpg     -> Maternity gallery
//   src/photos/banner/desktop.jpg    -> homepage banner (wide)
//   src/photos/banner/mobile.jpg     -> homepage banner (tall)
//
// Vite compresses them, adds a cache-busting hash and bundles them at
// build time, so they load fast and the links never break.
//
// Folder names must match the `slug` values in src/data/site.js.
// ---------------------------------------------------------------

const files = import.meta.glob(
  '../photos/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)

// { wedding: ['/assets/001-a1b2c3.jpg', ...], banner: [...] }
const byFolder = {}
for (const path in files) {
  const m = path.match(/\.\.\/photos\/([^/]+)\//)
  if (!m) continue
  const folder = m[1].toLowerCase()
  ;(byFolder[folder] ||= []).push({ path, url: files[path] })
}

// Sorted by filename, so 001, 002, 003 appear in the order you named them.
for (const folder in byFolder) {
  byFolder[folder].sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))
  byFolder[folder] = byFolder[folder].map((f) => f.url)
}

export function localPhotos(slug) {
  return byFolder[slug?.toLowerCase()] || []
}

// Banner images are matched by filename inside src/photos/banner/
// — anything containing "desktop" or "mobile".
export function localBanner(which) {
  const list = byFolder.banner || []
  return list.find((url) => url.toLowerCase().includes(which)) || null
}
