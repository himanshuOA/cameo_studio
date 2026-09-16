import { about, studio, categories } from '../data/site'
import Cameo from '../components/Cameo'
import { useCovers } from '../lib/useGallery'

export default function About() {
  const coverOf = useCovers()
  const c = categories.find((x) => x.slug === 'wedding')
  return (
    <>
      <div className="wrap page-head">
        <h1 className="t-h2">{about.headline}</h1>
      </div>
      <section className="wrap band-grid" style={{ paddingBottom: 64 }}>
        <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {about.body.map((p, i) => <p key={i} className={i === 0 ? 't-lead' : ''}>{p}</p>)}
          <p>
            Explore the portfolio &mdash; weddings, pre-wedding stories, maternity journeys, baby shoots, food,
            fashion catalogues and product showcases &mdash; and see photography that speaks beyond words.
          </p>
          <a className="btn btn-fill" style={{ alignSelf: 'start', marginTop: 8 }} href={studio.whatsapp} target="_blank" rel="noreferrer">
            Let&rsquo;s create something beautiful
          </a>
        </div>
        <Cameo src={coverOf(c)} alt="" ringText="Elegance, creativity, authenticity \u2022 " />
      </section>
    </>
  )
}
