# The Cameo Studio — website

React + Vite site for The Cameo Studio (Dadri, Greater Noida).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production files in /dist
```

Deploy `/dist` to Vercel, Netlify or Hostinger. `vercel.json` and `public/_redirects`
are already included so that page refreshes on `/portfolio/wedding` etc. work.

## Where things live

| Want to change…                        | Edit                          |
|----------------------------------------|-------------------------------|
| Phone, address, socials, passcode      | `src/data/site.js` → `studio` |
| Categories, their names, blurbs, order | `src/data/site.js` → `categories` |
| About text, process steps              | `src/data/site.js`            |
| Colours, fonts, spacing                | `src/styles/global.css` (`:root` tokens at the top) |
| Photo storage backend                  | `src/lib/storage.js`          |

Default images currently point at the old Google Sites URLs. Put your own files in
`public/images/` and reference them as `/images/filename.jpg` in `site.js`.

## Client uploads (`/admin`)

1. Open `yoursite.com/admin`
2. Enter the passcode (`adminPasscode` in `src/data/site.js` — change it before launch)
3. Pick a category → drag photos in or tap to choose → they appear on the site immediately
4. Hover a photo → × to remove it

Photos are resized in the browser to max 1800px before saving, so uploads are fast and
galleries stay light.

### How storage works today

Uploads are saved in the browser's IndexedDB. This works with zero setup and no hosting
costs, but **photos are only visible on the device that uploaded them**. It is perfect for
demoing the flow to the client.

### Going live with uploads (photos visible to everyone)

Only `src/lib/storage.js` needs to change. Keep the same three functions:

```js
listPhotos(categorySlug)  // -> [{ id, category, src, name, createdAt }]
addPhotos(categorySlug, File[])
removePhoto(id)
```

Recommended free-tier stack:

- **Cloudinary** (unsigned upload preset) for the image files
- **Firebase Firestore** or **Supabase** for the list of `{ id, category, src }`

Rough shape of the cloud version:

```js
export async function addPhotos(category, files) {
  const out = []
  for (const file of files) {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', 'cameostudio_unsigned')
    const r = await fetch('https://api.cloudinary.com/v1_1/<cloud-name>/image/upload', { method: 'POST', body: fd })
    const { secure_url, width, height } = await r.json()
    const photo = { id: crypto.randomUUID(), category, src: secure_url, w: width, h: height, name: file.name, createdAt: Date.now() }
    await addDoc(collection(db, 'photos'), photo)   // Firestore
    out.push(photo)
  }
  return out
}
```

The passcode login is client-side only, which is fine for a private upload page but not
for anything sensitive. If the cloud version is used, protect the Cloudinary preset with
a folder restriction and move the passcode check to Firebase Auth or a Supabase user.

## Pages

- `/` home — hero cameo, services list, about band, process, service areas
- `/portfolio` and `/portfolio/:slug` — galleries with a lightbox (arrow keys, Esc)
- `/about`, `/contact` — the contact form sends a pre-filled WhatsApp message, no server
- `/admin` — client photo uploads
