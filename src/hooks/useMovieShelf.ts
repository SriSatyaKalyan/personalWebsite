import { useState, useEffect } from 'react'
import { currentlyWatching, recentlyWatched, type Movie } from '../data/movies'

/* ── Types ──────────────────────────────────────────────────────── */
export interface MovieCard {
  title: string
  year: string
  posterUrl: string | null
  linkUrl: string
  status: 'watching' | 'watched'
  rating?: string   // e.g. "★★★★"
}

/* ── Cache ───────────────────────────────────────────────────────── */
// Bumped to _v2 so any old no-poster cache is automatically discarded
const CACHE_KEY_WATCHING = 'tmdb_watching_v2'
const CACHE_KEY_WATCHED  = 'tmdb_watched_v2'
const CACHE_KEY_LBD      = 'letterboxd_watched_v2'
const CACHE_TTL          = 30 * 60 * 1000 // 30 minutes

/* ── TMDB poster fetch ───────────────────────────────────────────── */
async function fetchTmdbPoster(movie: Movie): Promise<MovieCard> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined
  const base: MovieCard = {
    title:     movie.title,
    year:      movie.year?.toString() ?? '',
    posterUrl: null,
    linkUrl:   `https://www.themoviedb.org/search?query=${encodeURIComponent(movie.title)}`,
    status:    movie.status,
  }
  if (!apiKey) return base
  try {
    const params = new URLSearchParams({ query: movie.title, api_key: apiKey, include_adult: 'false' })
    if (movie.year) params.set('year', String(movie.year))
    const res  = await fetch(`https://api.themoviedb.org/3/search/multi?${params}`)
    const data = await res.json()
    const hit  = data.results?.[0]
    if (!hit) return base
    return {
      ...base,
      title:     hit.title ?? hit.name ?? movie.title,
      year:      (hit.release_date ?? hit.first_air_date ?? '').slice(0, 4),
      posterUrl: hit.poster_path ? `https://image.tmdb.org/t/p/w342${hit.poster_path}` : null,
      linkUrl:   `https://www.themoviedb.org/${hit.media_type}/${hit.id}`,
    }
  } catch {
    return base
  }
}

/* ── Helpers to load one group with caching ─────────────────────── */
function movieListHash(movies: Movie[]): string {
  return movies.map(m => `${m.title}|${m.year ?? ''}`).join(',')
}

async function loadGroup(movies: Movie[], cacheKey: string): Promise<MovieCard[]> {
  if (!movies.length) return []
  const hash = movieListHash(movies)
  try {
    const raw = localStorage.getItem(cacheKey)
    if (raw) {
      const { data, ts, hash: cachedHash } = JSON.parse(raw) as { data: MovieCard[]; ts: number; hash: string }
      // Only use cache if it has real posters and movie list hasn't changed
      const hasPosters = data.some(c => c.posterUrl !== null)
      if (Date.now() - ts < CACHE_TTL && hasPosters && cachedHash === hash) return data
    }
  } catch { /* ignore */ }

  const cards = await Promise.all(movies.map(fetchTmdbPoster))
  try { localStorage.setItem(cacheKey, JSON.stringify({ data: cards, ts: Date.now(), hash })) }
  catch { /* storage full */ }
  return cards
}

/* ── Letterboxd RSS → recently watched ─────────────────────────── */
function extractImgSrc(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/)
  return m ? m[1] : null
}
function extractRating(html: string): string | undefined {
  const m = html.match(/(★+½?)/)
  return m ? m[1] : undefined
}

async function fetchLetterboxdWatched(username: string): Promise<MovieCard[]> {
  try {
    const rssUrl = `https://letterboxd.com/${username}/rss/`
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=20`
    const res    = await fetch(apiUrl)
    const data   = await res.json()
    if (data.status !== 'ok') return []
    return (data.items as Array<{
      title: string; link: string; description: string; categories?: string[]
    }>).map(item => ({
      title:     item.title,
      year:      (item.categories ?? []).find(c => /^\d{4}$/.test(c)) ?? '',
      posterUrl: extractImgSrc(item.description),
      linkUrl:   item.link,
      status:    'watched' as const,
      rating:    extractRating(item.description),
    }))
  } catch {
    return []
  }
}

/* ── Hook ────────────────────────────────────────────────────────── */
export function useMovieShelf() {
  const [watching, setWatching] = useState<MovieCard[]>([])
  const [watched,  setWatched]  = useState<MovieCard[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const username = import.meta.env.VITE_LETTERBOXD_USERNAME as string | undefined

    async function load() {
      // Currently watching — TMDB
      const watchingCards = await loadGroup(currentlyWatching, CACHE_KEY_WATCHING)

      // Manually tracked watched — TMDB
      const manualWatched = await loadGroup(recentlyWatched, CACHE_KEY_WATCHED)

      // Letterboxd RSS — append after manual, dedupe by title
      let lbdCards: MovieCard[] = []
      if (username) {
        try {
          const raw = localStorage.getItem(CACHE_KEY_LBD)
          if (raw) {
            const { data, ts } = JSON.parse(raw) as { data: MovieCard[]; ts: number }
            if (Date.now() - ts < CACHE_TTL) lbdCards = data
          }
        } catch { /* ignore */ }
        if (!lbdCards.length) {
          lbdCards = await fetchLetterboxdWatched(username)
          try { localStorage.setItem(CACHE_KEY_LBD, JSON.stringify({ data: lbdCards, ts: Date.now() })) }
          catch { /* storage full */ }
        }
      }

      // Merge: manual first, then Letterboxd entries not already in manual list
      const manualTitles = new Set(manualWatched.map(c => c.title.toLowerCase()))
      const merged = [
        ...manualWatched,
        ...lbdCards.filter(c => !manualTitles.has(c.title.toLowerCase())),
      ]

      setWatching(watchingCards)
      setWatched(merged)
      setLoading(false)
    }

    load()
  }, [])

  return { watching, watched, loading }
}
