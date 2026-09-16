import { Link } from 'react-router-dom'
import { categories } from '../data/site'
import { useCovers } from '../lib/useGallery'
import Tilt from '../components/Tilt'

export default function Portfolio() {
  const coverOf = useCovers()
  return (
    <>
      <div className="wrap page-head">
        <h1 className="t-h2">Portfolio</h1>
        <p className="t-lead">Every category opens into its own gallery.</p>
      </div>
      <div className="wrap" style={{ paddingBottom: 40 }}>
        {categories.map((c) => (
          <Link className="svc-row" to={`/portfolio/${c.slug}`} key={c.slug}>
            <Tilt className="svc-thumb" max={18}>{coverOf(c) ? <img src={coverOf(c)} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} /> : null}</Tilt>
            <div>
              <div className="svc-name">{c.name}</div>
              <p className="svc-blurb">{c.blurb}</p>
            </div>
            <span className="svc-go" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
