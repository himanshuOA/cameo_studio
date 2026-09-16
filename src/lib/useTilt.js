import { useRef, useEffect } from 'react'

// Mouse-driven 3D tilt. Sets CSS vars --rx, --ry (rotation), --px, --py
// (pointer position 0..1) on the element so CSS can build the 3D effect.
// Respects prefers-reduced-motion and does nothing on touch-only devices.
export function useTilt({ max = 12, scale = 1.02 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduce || !fine) return

    let raf = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`)
        el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`)
        el.style.setProperty('--px', px)
        el.style.setProperty('--py', py)
        el.style.setProperty('--s', scale)
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--px', 0.5)
      el.style.setProperty('--py', 0.5)
      el.style.setProperty('--s', 1)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); cancelAnimationFrame(raf) }
  }, [max, scale])

  return ref
}
