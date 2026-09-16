// ---------------------------------------------------------------
// Photo storage adapter.
//
// The site reads/writes uploaded photos ONLY through this interface:
//   listPhotos(categorySlug) -> [{ id, category, src, name, createdAt }]
//   addPhotos(categorySlug, File[]) -> [photo]
//   removePhoto(id)
//
// Today it uses IndexedDB in the browser (works instantly, no server,
// but photos live only on the device that uploaded them).
//
// When the client wants photos visible to everyone, replace the
// functions below with a cloud version (Cloudinary unsigned upload +
// Firebase Firestore, or Supabase Storage). Nothing else in the site
// needs to change. See README.md > "Going live with uploads".
// ---------------------------------------------------------------

const DB_NAME = 'cameostudio'
const STORE = 'photos'
const VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('category', 'category', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode)
    const store = t.objectStore(STORE)
    const out = fn(store)
    t.oncomplete = () => resolve(out)
    t.onerror = () => reject(t.error)
    t.onabort = () => reject(t.error)
  })
}

// Downscale to keep IndexedDB small and the gallery fast.
function fileToDataURL(file, maxEdge = 1800, quality = 0.86) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve({ src: canvas.toDataURL('image/jpeg', quality), w: canvas.width, h: canvas.height })
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Could not read ${file.name}`)) }
    img.src = url
  })
}

export async function listPhotos(category) {
  const db = await openDB()
  const all = await new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  const rows = category ? all.filter((p) => p.category === category) : all
  return rows.sort((a, b) => b.createdAt - a.createdAt)
}

export async function addPhotos(category, files) {
  const db = await openDB()
  const photos = []
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    const { src, w, h } = await fileToDataURL(file)
    photos.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      category,
      name: file.name,
      src,
      w,
      h,
      createdAt: Date.now(),
    })
  }
  await tx(db, 'readwrite', (store) => photos.forEach((p) => store.put(p)))
  return photos
}

export async function removePhoto(id) {
  const db = await openDB()
  await tx(db, 'readwrite', (store) => store.delete(id))
}

export async function countPhotos() {
  const all = await listPhotos()
  return all.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc }, {})
}
