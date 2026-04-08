import { useState, useEffect } from 'react'
import { getDailyReview, ReadwiseHighlight } from '../lib/readwise'

interface State {
  highlights: ReadwiseHighlight[]
  loading: boolean
  error: string | null
}

export function useReadwise() {
  const [state, setState] = useState<State>({ highlights: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    getDailyReview()
      .then(highlights => { if (!cancelled) setState({ highlights, loading: false, error: null }) })
      .catch(err        => { if (!cancelled) setState({ highlights: [], loading: false, error: err.message }) })
    return () => { cancelled = true }
  }, [])

  return state
}
