import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data/site'
import { useCovers } from '../lib/useGallery'
import { prefersFlat } from '../lib/use3d'

const DRAG_THRESHOLD = 8 // px of movement before it counts as a drag, not a click

// Categories arranged around a cylinder you can spin: drag it with the
// mouse or a finger, scroll over it, use the arrow keys, or leave it
// alone and it turns on its own.
export default function Carousel3D() {
  const coverOf = useCovers()
  const navigate = useNavigate()
  const items = categories
  const step = 360 / items.length
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState(0)        // degrees, while dragging
  const [dragging, setDragging] = useState(false)
  const [idle, setIdle] = useState(true)
  const start = useRef(null)
  const moved = useRef(0)
  const wheelLock = useRef(0)
  const dragRef = useRef(0)

  useEffect(() => { dragRef.current = drag }, [drag])

  const go = useCallback((d) => { setIndex((i) => i + d); setIdle(false) }, [])

  // Turns by itself until someone touches it
  useEffect(() => {
    if (!idle || prefersFlat()) return
    const t = setInterval(() => setIndex((i) => i + 1), 4200)
    return () => clearInterval(t)
  }, [idle])

  useEffect(() => {
    if (idle) return
    const t = setTimeout(() => setIdle(true), 9000)
    return () => clearTimeout(t)
  }, [idle, index])

  // Drag is tracked on the window rather than with setPointerCapture:
  // while a pointer is captured the browser sends the click to the
  // capturing element, which would swallow the card's link.
  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    start.current = { x: e.clientX }
    moved.current = 0
    setDragging(true)
    setIdle(false)
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      if (!start.current) return
      const dx = e.clientX - start.current.x
      moved.current = Math.abs(dx)
      setDrag(dx * 0.35)
    }
    const onUp = () => {
      setIndex((i) => i - Math.round(dragRef.current / step))
      setDrag(0)
      setDragging(false)
      start.current = null
      // let the click that follows this pointerup see the distance,
      // then forget it so the next plain click works
      setTimeout(() => { moved.current = 0 }, 0)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, step])

  const active = ((index % items.length) + items.length) % items.length

  // Horizontal scroll over the case turns it; vertical scroll is left
  // alone so the page keeps scrolling normally.
  const onWheel = (e) => {
    const now = Date.now()
    if (now < wheelLock.current) return
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0
    if (!delta) return
    wheelLock.current = now + 220
    go(delta > 0 ? 1 : -1)
  }

  // A click on the front card opens its gallery. A click on a card at
  // the side turns that one to the front first, so nothing opens by
  // accident from an edge-on sliver.
  const open = (e, slug, i) => {
    // Ctrl/cmd/middle click: let the browser open it in a new tab as normal.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
    e.preventDefault()
    if (moved.current > DRAG_THRESHOLD) return   // that was a drag, not a click
    if (i !== active) {
      // shortest way round to that card
      let d = (i - active + items.length) % items.length
      if (d > items.length / 2) d -= items.length
      go(d)
      return
    }
    navigate(`/portfolio/${slug}`)
  }

  const rotation = -index * step + drag

  return (
    <div className="carousel">
      <div
        className={`carousel-stage ${dragging ? 'is-dragging' : ''}`}
        style={{ '--rot': `${rotation}deg` }}
        onPointerDown={onPointerDown}
        onDragStart={(e) => e.preventDefault()}
        onWheel={onWheel}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
          if (e.key === 'Enter') navigate(`/portfolio/${items[active].slug}`)
        }}
        tabIndex={0}
        role="group"
        aria-label="Photography categories. Use the left and right arrow keys to turn the case."
      >
        {items.map((c, i) => {
          const isActive = i === active
          return (
            <a
              key={c.slug}
              href={`/portfolio/${c.slug}`}
              className={`carousel-item ${isActive ? 'is-active' : ''}`}
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--carousel-r))` }}
              onClick={(e) => open(e, c.slug, i)}
              onDragStart={(e) => e.preventDefault()}
              draggable="false"
              tabIndex={isActive ? 0 : -1}
              aria-label={`Open the ${c.name} gallery`}
            >
              <span className="carousel-card">
                {coverOf(c) ? <img src={coverOf(c)} alt="" loading="lazy" draggable="false" /> : null}
                <span className="carousel-glass" aria-hidden="true" />
                <span className="carousel-label">{c.name}</span>
              </span>
              <span className="carousel-plinth" aria-hidden="true" />
            </a>
          )
        })}
      </div>

      <div className="carousel-caption" key={active}>
        <h3 className="t-h3">{items[active].name}</h3>
        <p>{items[active].blurb}</p>
        <button className="btn" onClick={() => navigate(`/portfolio/${items[active].slug}`)}>
          Open {items[active].name} gallery
        </button>
      </div>

      <div className="carousel-controls">
        <button onClick={() => go(-1)} aria-label="Previous category">‹</button>
        <span className="t-small">{active + 1} / {items.length}</span>
        <button onClick={() => go(1)} aria-label="Next category">›</button>
      </div>
    </div>
  )
}
