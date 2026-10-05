import { useState, useCallback, useEffect } from 'react'
import { Link, NavLink, useParams, Navigate } from 'react-router-dom'
import { categories, studio } from '../data/site'
import { useGallery } from '../lib/useGallery'
import Lightbox from '../components/Lightbox'
import Tilt from '../components/Tilt'

// How many photos appear before the "Show more" button. A wedding
// gallery can run past 100 photos; loading them all at once would
// mean a slow first view for someone who only looks at the top ten.
const PAGE = 24

export default function Category() {
  const { slug } = useParams()
  const { category, photos, loading } = useGallery(slug)
  const [open, setOpen] = useState(-1)
  const [shown, setShown] = useState(PAGE)

  // Start fresh when moving to another category
  useEffect(() => { setShown(PAGE) }, [slug])

  const move = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length])
  const close = useCallback(() => setOpen(-1), [])

  if (!category) return <Navigate to="/portfolio" replace />

  const visible = photos.slice(0, shown)
  const remaining = photos.length - visible.length

  return (
    <>
      <div className="wrap page-head">
        <div className="crumbs"><Link to="/portfolio">Portfolio</Link> / {category.name}</div>
        <h1 className="t-h2">{category.name}</h1>
        <p className="t-lead">{category.blurb}</p>
        <nav className="cat-nav" aria-label="Categories">
          {categories.map((c) => (
            <NavLink key={c.slug} to={`/portfolio/${c.slug}`} className={({ isActive }) => (isActive ? 'active' : '')}>{c.name}</NavLink>
          ))}
        </nav>
      </div>

      <div className="wrap" style={{ paddingBottom: 40 }}>
        {!loading && photos.length === 0 ? (
          <div className="empty">
            <div className="t-h3">No photos in {category.name} yet</div>
            <p>Ask us on WhatsApp and we&rsquo;ll send recent work from this category.</p>
            <a className="btn" style={{ marginTop: 20 }} href={studio.whatsapp} target="_blank" rel="noreferrer">Request samples</a>
          </div>
        ) : (
          <>
            <div className="masonry">
              {visible.map((p, i) => (
                <Tilt as="figure" key={p.id} max={8} scale={1.02}>
                  <button onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}`}>
                    <img src={p.src} alt="" loading="lazy" decoding="async" />
                  </button>
                </Tilt>
              ))}
            </div>

            {remaining > 0 && (
              <div className="gallery-more">
                <button className="btn" onClick={() => setShown((n) => n + PAGE)}>
                  Show {Math.min(PAGE, remaining)} more
                </button>
                <p className="t-small">{visible.length} of {photos.length} photos</p>
              </div>
            )}
          </>
        )}
      </div>

      {open >= 0 && <Lightbox photos={photos} index={open} onClose={close} onMove={move} />}
    </>
  )
}
