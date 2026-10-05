import { Link } from 'react-router-dom'
import { studio, categories } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-studio">
            <div className="brand">
              <span className="brand-name">The Cameo</span>
              <span className="brand-sub">Studio</span>
            </div>
            <p>{studio.address}</p>
            <p>Serving {studio.serviceAreas.join(', ')}.</p>
            <p className="footer-contact">
              <a href={`tel:+${studio.phoneRaw}`}>{studio.phoneDisplay}</a>
              <a href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            </p>
          </div>

          <div>
            <h4>Portfolio</h4>
            {/* 14 categories in one column made the footer taller than a
                phone screen, so the list runs in columns instead */}
            <ul className="footer-cats">
              {categories.map((c) => (
                <li key={c.slug}><Link to={`/portfolio/${c.slug}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {studio.name}</span>
          <span className="footer-social">
            <a href={studio.social.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={studio.social.youtube} target="_blank" rel="noreferrer">YouTube</a>
            <a href={studio.social.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
