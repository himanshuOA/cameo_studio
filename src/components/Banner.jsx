import { useEffect, useState } from 'react'
import { banner, studio } from '../data/site'
import { listPhotos } from '../lib/storage'

// Storage slots the admin page writes to.
export const BANNER_DESKTOP = 'banner-desktop'
export const BANNER_MOBILE = 'banner-mobile'

export default function Banner() {
  const [uploaded, setUploaded] = useState({})

  useEffect(() => {
    Promise.all([listPhotos(BANNER_DESKTOP), listPhotos(BANNER_MOBILE)])
      .then(([d, m]) => setUploaded({ desktop: d[0]?.src, mobile: m[0]?.src }))
      .catch(() => {})
  }, [])

  if (!banner.show) return null

  const desktop = uploaded.desktop || banner.desktop
  const mobile = uploaded.mobile || banner.mobile || desktop
  const link = banner.ctaLink || studio.whatsapp
  if (!desktop && !mobile) return null

  return (
    <section className="banner" aria-label="Announcement">
      <picture className="banner-media">
        <source media="(max-width: 767px)" srcSet={mobile} />
        <img src={desktop} alt={banner.alt} fetchPriority="high" />
      </picture>

      {(banner.heading || banner.text) && (
        <div className="banner-overlay">
          <div className="wrap banner-copy">
            {banner.heading && <h2 className="t-h3">{banner.heading}</h2>}
            {banner.text && <p>{banner.text}</p>}
            {banner.ctaLabel && (
              <a className="btn btn-fill" href={link} target="_blank" rel="noreferrer">{banner.ctaLabel}</a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
