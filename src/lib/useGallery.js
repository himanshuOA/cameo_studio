import { useEffect, useState, useCallback } from 'react'
import { categories } from '../data/site'
import { listPhotos } from './storage'
import { localPhotos } from './localPhotos'

// Photos come from three places, in this order of priority:
//   1. uploaded through /admin  (newest first)
//   2. src/photos/<slug>/       (files added to the project)
//   3. images listed in site.js (the placeholders)
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

  const local = localPhotos(slug).map((src, i) => ({
    id: `local-${slug}-${i}`, src, category: slug, isLocal: true,
  }))

  // Once there are real photos in the folder, the placeholders step aside.
  const defaults = local.length
    ? []
    : (category?.images || []).filter(Boolean).map((src, i) => ({
        id: `default-${slug}-${i}`, src, category: slug, isDefault: true,
      }))

  return { category, photos: [...uploaded, ...local, ...defaults], loading, refresh }
}

// Cover image for a category: an uploaded photo wins, then the first
// file in src/photos/<slug>/, then the cover set in site.js.
export function useCovers() {
  const [covers, setCovers] = useState({})
  useEffect(() => {
    listPhotos().then((all) => {
      const map = {}
      for (const p of all) if (!map[p.category]) map[p.category] = p.src
      setCovers(map)
    }).catch(() => {})
  }, [])
  return (cat) => covers[cat.slug] || localPhotos(cat.slug)[0] || cat.cover
}
