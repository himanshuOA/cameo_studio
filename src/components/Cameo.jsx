import { useTilt } from '../lib/useTilt'

// The oval "cameo": an engraved rotating ring, a raised frame and the
// photo, stacked at different depths so they separate in 3D as the
// cursor moves. Signature element — use once per page at most.
export default function Cameo({ src, alt = '', ringText }) {
  const ref = useTilt({ max: 14, scale: 1 })
  const text = (ringText || 'Echoes of light and time \u2022 The Cameo Studio \u2022 ').repeat(3)
  return (
    <div className="cameo" ref={ref}>
      <div className="cameo-stage">
        <div className="cameo-shadow" aria-hidden="true" />
        <svg className="cameo-ring" viewBox="0 0 400 500" aria-hidden="true">
          <defs><path id="ring" d="M200,12 A188,238 0 1,1 199.9,12" /></defs>
          <use href="#ring" className="ring-line" />
          <text><textPath href="#ring" startOffset="0">{text}</textPath></text>
        </svg>
        <div className="cameo-bezel" aria-hidden="true" />
        <div className="cameo-frame">
          {src ? <img src={src} alt={alt} loading="eager" onError={(e) => { e.currentTarget.style.display = 'none' }} /> : null}
          <span className="cameo-light" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
