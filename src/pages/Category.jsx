import { useState, useCallback } from 'react'
import { Link, NavLink, useParams, Navigate } from 'react-router-dom'
import { categories, studio } from '../data/site'
import { useGallery } from '../lib/useGallery'
import Lightbox from '../components/Lightbox'
import Tilt from '../components/Tilt'

export default function Category() {
  const { slug } = useParams()
  const { category, photos, loading } = useGallery(slug)
  const [open, setOpen] = useState(-1)

  const move = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length])
  const close = useCallback(() => setOpen(-1), [])

  if (!category) return <Navigate to="/portfolio" replace />

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
          <div className="masonry">
            {photos.map((p, i) => (
              <Tilt as="figure" key={p.id} max={8} scale={1.02}>
                <button onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1}`}>
                  <img src={p.src} alt="" loading="lazy" />
                </button>
              </Tilt>
            ))}
          </div>
        )}
      </div>

      {open >= 0 && <Lightbox photos={photos} index={open} onClose={close} onMove={move} />}
    </>
  )
}
