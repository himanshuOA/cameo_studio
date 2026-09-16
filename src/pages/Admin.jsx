import { useEffect, useRef, useState } from 'react'
import { studio, categories } from '../data/site'
import { listPhotos, addPhotos, removePhoto, countPhotos } from '../lib/storage'
import { BANNER_DESKTOP, BANNER_MOBILE } from '../components/Banner'

const SESSION_KEY = 'cameo-admin'

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')

  const login = (e) => {
    e.preventDefault()
    if (code === studio.adminPasscode) { sessionStorage.setItem(SESSION_KEY, '1'); setAuthed(true) }
    else setErr('That passcode is not right.')
  }

  if (!authed) {
    return (
      <form className="wrap admin-login" onSubmit={login}>
        <h1 className="t-h2">Studio admin</h1>
        <div className="field">
          <label htmlFor="code">Passcode</label>
          <input id="code" type="password" value={code} onChange={(e) => { setCode(e.target.value); setErr('') }} autoFocus />
        </div>
        {err && <div className="notice err">{err}</div>}
        <button className="btn btn-fill" type="submit">Open admin</button>
      </form>
    )
  }
  return <Uploader onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false) }} />
}

// Banner slots hold one image each and are replaced on upload.
const SLOTS = [
  { slug: BANNER_DESKTOP, name: 'Banner \u2014 desktop', hint: 'Wide, about 1920 \u00d7 700', single: true },
  { slug: BANNER_MOBILE, name: 'Banner \u2014 mobile', hint: 'Tall, about 900 \u00d7 1100', single: true },
]
const ALL = [...SLOTS, ...categories]

function Uploader({ onLogout }) {
  const [cat, setCat] = useState(ALL[0].slug)
  const [photos, setPhotos] = useState([])
  const [counts, setCounts] = useState({})
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const [over, setOver] = useState(false)
  const fileRef = useRef()

  const refresh = async () => {
    setPhotos(await listPhotos(cat))
    setCounts(await countPhotos())
  }
  useEffect(() => { refresh() }, [cat])

  const upload = async (files) => {
    if (!files?.length) return
    setBusy(true); setNote('')
    try {
      const slot = ALL.find((c) => c.slug === cat)
      // A banner slot holds one image, so clear the old one first.
      if (slot.single) {
        const existing = await listPhotos(cat)
        await Promise.all(existing.map((p) => removePhoto(p.id)))
      }
      const picked = slot.single ? [Array.from(files)[0]] : Array.from(files)
      const added = await addPhotos(cat, picked)
      setNote(`${added.length} photo${added.length === 1 ? '' : 's'} added to ${slot.name}.`)
      await refresh()
    } catch (e) {
      setNote(`Upload failed: ${e.message}`)
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const del = async (id) => {
    if (!confirm('Remove this photo?')) return
    await removePhoto(id)
    await refresh()
  }

  const current = ALL.find((c) => c.slug === cat)

  return (
    <div className="wrap admin">
      <div className="admin-bar">
        <div>
          <h1 className="t-h2">Photos</h1>
          <p className="t-small">Upload to a category and it appears on the site right away.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a className="btn" href={`/portfolio/${cat}`} target="_blank" rel="noreferrer">View gallery</a>
          <button className="btn btn-ghost" onClick={onLogout}>Log out</button>
        </div>
      </div>

      <div className="admin-grid">
        <ul className="admin-cats">
          {ALL.map((c) => (
            <li key={c.slug}>
              <button className={c.slug === cat ? 'active' : ''} onClick={() => setCat(c.slug)}>
                {c.name}
                {counts[c.slug] ? <span className="count">{counts[c.slug]}</span> : null}
              </button>
            </li>
          ))}
        </ul>

        <div>
          <label
            className={`drop ${over ? 'over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setOver(true) }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files) }}
          >
            <div className="t-h3">{busy ? 'Adding photos\u2026' : (current.single ? `Replace the ${current.name.toLowerCase()} image` : `Drop photos for ${current.name} here`)}</div>
            <p>{current.hint ? `${current.hint}. ` : ''}Tap to choose, or drop files here. JPG, PNG, WEBP.</p>
            <input ref={fileRef} type="file" accept="image/*" multiple={!current.single} onChange={(e) => upload(e.target.files)} disabled={busy} />
          </label>
          {note && <div className="notice">{note}</div>}

          {photos.length === 0 ? (
            <div className="empty" style={{ marginTop: 24 }}>
              <div className="t-h3">Nothing uploaded here yet</div>
              <p>{current.single ? 'The default banner image from the site setup is being used.' : 'Default photos from the site setup still show in the gallery.'}</p>
            </div>
          ) : (
            <div className="admin-photos">
              {photos.map((p) => (
                <figure key={p.id}>
                  <img src={p.src} alt={p.name} />
                  <button className="del" aria-label={`Remove ${p.name}`} onClick={() => del(p.id)}>×</button>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
