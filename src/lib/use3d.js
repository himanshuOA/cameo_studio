import { useEffect, useRef, useState } from 'react'

export function prefersFlat() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Reveals a section once, the moment any part of it enters the viewport,
// then leaves it fully opaque. Only the depth transform animates —
// nothing stays faded while you read it.
export function useDepth() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersFlat()) { el.classList.add('is-in'); return }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )
    io.observe(el)
    // Anything already on screen at load shows immediately.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight) el.classList.add('is-in')
    return () => io.disconnect()
  }, [])
  return ref
}

// Parallax driven by the pointer across the whole viewport.
// Sets --mx / --my (-1..1) on <html> so any layer can read them.
export function useGlobalParallax() {
  useEffect(() => {
    if (prefersFlat() || !window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2
        const my = (e.clientY / window.innerHeight - 0.5) * 2
        document.documentElement.style.setProperty('--mx', mx.toFixed(3))
        document.documentElement.style.setProperty('--my', my.toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])
}

export function useSpring(target, stiffness = 0.12) {
  const [value, setValue] = useState(target)
  const v = useRef(target)
  useEffect(() => {
    let raf
    const tick = () => {
      const d = target - v.current
      if (Math.abs(d) < 0.0005) { v.current = target; setValue(target); return }
      v.current += d * stiffness
      setValue(v.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, stiffness])
  return value
}
