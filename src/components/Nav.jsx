import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { studio } from '../data/site'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="brand" aria-label={`${studio.name} home`}>
          <span className="brand-mark" aria-hidden="true" />
          {studio.name}
        </Link>

        <nav aria-label="Main">
          <ul id="main-menu" className={`nav-links ${open ? 'open' : ''}`}>
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => (isActive || (l.to === '/portfolio' && pathname.startsWith('/portfolio')) ? 'active' : '')}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn-fill nav-cta" href={studio.whatsapp} target="_blank" rel="noreferrer">
          Book a shoot
        </a>

        <button
          className="nav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
        </button>
      </div>
    </header>
  )
}
