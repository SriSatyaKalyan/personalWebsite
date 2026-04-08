const CLIENT_ID     = import.meta.env.VITE_SPOTIFY_CLIENT_ID     as string
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET  as string
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN  as string

export interface SpotifyTrack {
  id: string
  name: string
  artists: string[]
  album: string
  albumArt: string
  url: string
  previewUrl: string | null
}

let cachedAccessToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 30_000) {
    return cachedAccessToken
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  })

  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`)
  const data = await res.json()

  cachedAccessToken = data.access_token
  tokenExpiresAt    = Date.now() + data.expires_in * 1000
  return cachedAccessToken!
}

export async function getTopTracks(limit = 5): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()

  const res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=short_term`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) throw new Error(`Spotify top tracks failed: ${res.status}`)
  const data = await res.json()

  return data.items.map((item: any) => ({
    id:         item.id,
    name:       item.name,
    artists:    item.artists.map((a: any) => a.name),
    album:      item.album.name,
    albumArt:   item.album.images[1]?.url ?? item.album.images[0]?.url ?? '',
    url:        item.external_urls.spotify,
    previewUrl: item.preview_url,
  }))
}
