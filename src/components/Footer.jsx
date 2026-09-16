import { Link } from 'react-router-dom'
import { studio, categories } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand"><span className="brand-mark" aria-hidden="true" />{studio.name}</div>
            <p>{studio.address}</p>
            <p style={{ marginTop: 12 }}>Serving {studio.serviceAreas.join(', ')}.</p>
          </div>
          <div>
            <h4>Portfolio</h4>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}><Link to={`/portfolio/${c.slug}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Reach us</h4>
            <ul>
              <li><a href={`tel:+${studio.phoneRaw}`}>Call {studio.phoneDisplay}</a></li>
              <li><a href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></li>
              <li><a href={studio.social.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href={studio.social.youtube} target="_blank" rel="noreferrer">YouTube</a></li>
              <li><a href={studio.social.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {studio.name}</span>
          <span>{studio.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
