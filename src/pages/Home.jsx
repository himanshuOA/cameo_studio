import { Link } from 'react-router-dom'
import { studio, categories, about, process } from '../data/site'
import Cameo from '../components/Cameo'
import Tilt from '../components/Tilt'
import Depth from '../components/Depth'
import Carousel3D from '../components/Carousel3D'
import Banner from '../components/Banner'
import { useCovers } from '../lib/useGallery'
import { useGlobalParallax } from '../lib/use3d'

const groups = ['People', 'Events', 'Brands']

export default function Home() {
  const coverOf = useCovers()
  useGlobalParallax()
  const hero = categories.find((c) => c.slug === 'pre-wedding')
  const drifters = ['wedding', 'maternity', 'food', 'baby'].map((s) => categories.find((c) => c.slug === s))

  return (
    <>
      <Banner />

      <section className="hero reveal">
        {/* photo planes drifting at different depths behind the cameo */}
        <div className="drift" aria-hidden="true">
          {drifters.map((c, i) => (
            <span key={c.slug} className={`drift-plane d${i + 1}`}>
              {coverOf(c) ? <img src={coverOf(c)} alt="" loading="lazy" /> : null}
            </span>
          ))}
        </div>

        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="t-display">Echoes of light &amp; time.</h1>
            <p className="t-lead">
              Wedding, family and brand photography from Greater Noida, made for people who
              want their pictures to still feel true in twenty years.
            </p>
            <div className="hero-actions">
              <a className="btn btn-fill" href={studio.whatsapp} target="_blank" rel="noreferrer">Book on WhatsApp</a>
              <Link className="btn" to="/portfolio">See the work</Link>
            </div>
            <div className="hero-meta">
              <div><strong>11</strong><span className="t-small">kinds of shoots</span></div>
              <div><strong>6</strong><span className="t-small">cities across NCR</span></div>
              <div><strong>2 wks</strong><span className="t-small">to delivery</span></div>
            </div>
          </div>
          <Cameo src={coverOf(hero)} alt="A couple photographed by The Cameo Studio" />
        </div>

        <div className="scroll-hint" aria-hidden="true"><span />Scroll</div>
      </section>

      {/* The turning display case */}
      <Depth className="section vitrine" id="vitrine">
        <div className="wrap">
          <div className="section-head">
            <h2 className="t-h2">Turn the case</h2>
            <p>Drag it, or use the arrows. Each piece opens into its own gallery.</p>
          </div>
        </div>
        <Carousel3D />
      </Depth>

      <Depth className="section" id="services">
        <div className="wrap">
          <div className="section-head">
            <h2 className="t-h2">What we photograph</h2>
            <p>Pick the one closest to your occasion. If it isn&rsquo;t here, ask &mdash; we probably still do it.</p>
          </div>

          {groups.map((g) => (
            <div className="svc-group" key={g}>
              <div className="svc-group-name">{g}</div>
              {categories.filter((c) => c.group === g).map((c) => (
                <Link className="svc-row" to={`/portfolio/${c.slug}`} key={c.slug}>
                  <Tilt className="svc-thumb" max={18}>
                    {coverOf(c) ? <img src={coverOf(c)} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} /> : null}
                  </Tilt>
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
          ))}
        </div>
      </Depth>

      <Depth className="band section">
        <div className="wrap band-grid">
          <h2 className="t-h2">{about.headline}</h2>
          <div className="stack">
            {about.body.slice(0, 3).map((p, i) => <p key={i}>{p}</p>)}
            <Link className="btn btn-ghost" to="/about" style={{ color: 'inherit', alignSelf: 'start' }}>More about the studio</Link>
          </div>
        </div>
      </Depth>

      <Depth className="section">
        <div className="wrap">
          <div className="section-head"><h2 className="t-h2">How a shoot works</h2></div>
          <ol className="process">
            {process.map((p, i) => (
              <li key={p.step}>
                <div className="num">{i + 1}</div>
                <h3 className="t-h3">{p.step}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Depth>

      <Depth className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head"><h2 className="t-h2">Where we shoot</h2></div>
          <div className="areas">
            {studio.serviceAreas.map((a) => <span key={a}>{a}</span>)}
          </div>
          <p className="t-small" style={{ marginTop: 16 }}>Studio at {studio.address}. Outdoor and destination shoots on request.</p>
        </div>
      </Depth>
    </>
  )
}
