import { useState, useEffect } from 'react'

const CACHE_KEY = 'unsplash_photos_v1'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export interface UnsplashPhoto {
  id: string
  urls: { regular: string; small: string; thumb: string }
  alt_description: string | null
  description: string | null
  likes: number
  width: number
  height: number
  links: { html: string }
}

export function useUnsplash() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  useEffect(() => {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined
    const username  = import.meta.env.VITE_UNSPLASH_USERNAME  as string | undefined

    if (!accessKey || !username) {
      setError(true)
      setLoading(false)
      return
    }

    // Serve from cache if still fresh
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const { data, ts } = JSON.parse(raw) as { data: UnsplashPhoto[]; ts: number }
        if (Date.now() - ts < CACHE_TTL) {
          setPhotos(data)
          setLoading(false)
          return
        }
      }
    } catch { /* ignore corrupt cache */ }

    fetch(
      `https://api.unsplash.com/users/${username}/photos?per_page=20&order_by=popular`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    )
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then((data: UnsplashPhoto[]) => {
        setPhotos(data)
        setLoading(false)
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) }
        catch { /* storage full — skip cache */ }
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  return { photos, loading, error }
}
