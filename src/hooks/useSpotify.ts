import { useState, useEffect } from 'react'
import { getTopTracks, SpotifyTrack } from '../lib/spotify'

interface State {
  tracks: SpotifyTrack[]
  loading: boolean
  error: string | null
}

export function useSpotify() {
  const [state, setState] = useState<State>({ tracks: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    getTopTracks(5)
      .then(tracks => { if (!cancelled) setState({ tracks, loading: false, error: null }) })
      .catch(err   => { if (!cancelled) setState({ tracks: [], loading: false, error: err.message }) })
    return () => { cancelled = true }
  }, [])

  return state
}
