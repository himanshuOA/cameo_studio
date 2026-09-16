import { useEffect, useState, useCallback } from 'react'
import { categories } from '../data/site'
import { listPhotos } from './storage'

// Merges the default images from site.js with anything the client
// uploaded through /admin. Uploaded photos come first.
export function useGallery(slug) {
  const category = categories.find((c) => c.slug === slug)
  const [uploaded, setUploaded] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setUploaded(await listPhotos(slug))
    } catch {
      setUploaded([])
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => { refresh() }, [refresh])

  const defaults = (category?.images || []).filter(Boolean).map((src, i) => ({
    id: `default-${slug}-${i}`, src, category: slug, w: 4, h: 5, isDefault: true,
  }))

  return { category, photos: [...uploaded, ...defaults], loading, refresh }
}

// Cover for a category: latest uploaded photo, else the default cover.
export function useCovers() {
  const [covers, setCovers] = useState({})
  useEffect(() => {
    listPhotos().then((all) => {
      const map = {}
      for (const p of all) if (!map[p.category]) map[p.category] = p.src
      setCovers(map)
    }).catch(() => {})
  }, [])
  return (cat) => covers[cat.slug] || cat.cover
}
