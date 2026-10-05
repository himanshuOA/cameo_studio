import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Lightbox({ photos, index, onClose, onMove }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, onMove])

  const photo = photos[index]
  if (!photo) return null

  // Rendered straight into <body>. Inside the page it would sit under
  // <main>, which carries a transform from the route animation, and a
  // transformed ancestor makes position:fixed size itself to that
  // ancestor instead of the viewport — on a long gallery the photo
  // ends up centred thousands of pixels down the page.
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <img src={photo.src} alt={photo.name || ''} onClick={(e) => e.stopPropagation()} />
      <button className="lb-btn lb-close" aria-label="Close" onClick={onClose}>×</button>
      {photos.length > 1 && (
        <>
          <button className="lb-btn lb-prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onMove(-1) }}>‹</button>
          <button className="lb-btn lb-next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onMove(1) }}>›</button>
        </>
      )}
      <span className="lb-count">{index + 1} / {photos.length}</span>
    </div>,
    document.body,
  )
}
