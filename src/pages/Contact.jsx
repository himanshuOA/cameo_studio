import { useState } from 'react'
import { studio, categories } from '../data/site'

export default function Contact() {
  const [f, setF] = useState({ name: '', phone: '', type: categories[0].name, date: '', message: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  // Sends the enquiry as a pre-filled WhatsApp message. No server needed.
  const send = (e) => {
    e.preventDefault()
    const lines = [
      `Hi, I'm ${f.name}.`,
      `Shoot type: ${f.type}`,
      f.date && `Date: ${f.date}`,
      f.phone && `Phone: ${f.phone}`,
      f.message && `\n${f.message}`,
    ].filter(Boolean)
    window.open(`${studio.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener')
  }

  return (
    <>
      <div className="wrap page-head">
        <h1 className="t-h2">Contact</h1>
        <p className="t-lead">Tell us about the occasion and we&rsquo;ll reply on WhatsApp, usually the same day.</p>
      </div>
      <section className="wrap contact-grid" style={{ paddingBottom: 48 }}>
        <dl className="contact-list">
          <div><dt>Call or WhatsApp</dt><dd><a href={studio.whatsapp} target="_blank" rel="noreferrer">{studio.phoneDisplay}</a></dd></div>
          <div><dt>Studio</dt><dd style={{ fontSize: '1.1rem', lineHeight: 1.4 }}>{studio.address}</dd></div>
          <div><dt>Service areas</dt><dd style={{ fontSize: '1.1rem', lineHeight: 1.4 }}>{studio.serviceAreas.join(', ')}</dd></div>
          <div>
            <dt>Follow</dt>
            <dd style={{ fontSize: '1.1rem' }}>
              <a href={studio.social.instagram} target="_blank" rel="noreferrer">Instagram</a>{' \u00b7 '}
              <a href={studio.social.youtube} target="_blank" rel="noreferrer">YouTube</a>{' \u00b7 '}
              <a href={studio.social.facebook} target="_blank" rel="noreferrer">Facebook</a>
            </dd>
          </div>
        </dl>

        <form className="form" onSubmit={send}>
          <div className="form-row">
            <div className="field"><label htmlFor="name">Your name</label><input id="name" required value={f.name} onChange={set('name')} /></div>
            <div className="field"><label htmlFor="phone">Phone</label><input id="phone" type="tel" value={f.phone} onChange={set('phone')} /></div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="type">Type of shoot</label>
              <select id="type" value={f.type} onChange={set('type')}>
                {categories.map((c) => <option key={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div className="field"><label htmlFor="date">Date (if known)</label><input id="date" type="date" value={f.date} onChange={set('date')} /></div>
          </div>
          <div className="field"><label htmlFor="msg">Anything else</label><textarea id="msg" rows="4" value={f.message} onChange={set('message')} placeholder="Location, number of people, the mood you want…" /></div>
          <button className="btn btn-fill" type="submit" style={{ alignSelf: 'start' }}>Send on WhatsApp</button>
        </form>
      </section>
    </>
  )
}
