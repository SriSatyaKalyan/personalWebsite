import { useState, useEffect, useRef } from 'react'
import { useReadwise } from '../hooks/useReadwise'
import { songs, getSongCover } from '../data/songs'
import './Passions.css'

/* ── YouTube music widget ────────────────────────────────────────── */
function YoutubeWidget() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function toggleSong(id: string) {
    if (playingId === id) {
      // Pause via YouTube postMessage API
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*'
      )
      setPlayingId(null)
    } else {
      setPlayingId(id)
    }
  }

  return (
    <div className="passions__widget">
      <div className="passions__widget-header">
        <MusicIcon />
        <span className="passions__widget-title">What I'm Listening To</span>
      </div>

      {/* Hidden YouTube player — always in the DOM so it never shifts layout */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        {playingId && (
          <iframe
            key={playingId}
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${playingId}?autoplay=1&enablejsapi=1&controls=0`}
            allow="autoplay"
            title="audio-player"
          />
        )}
      </div>

      <ol className="passions__track-list">
        {songs.map((song, i) => {
          const isPlaying = playingId === song.id
          return (
            <li key={song.id} className="passions__track">
              <span className="passions__track-rank">{i + 1}</span>
              <img
                src={getSongCover(song)}
                alt={song.title}
                className="passions__track-art"
              />
              <div className="passions__track-info">
                <span className={`passions__track-name ${isPlaying ? 'passions__track-name--playing' : ''}`}>
                  {song.title}
                </span>
                <span className="passions__track-artist">{song.artist}</span>
              </div>
              <button
                className={`passions__preview-btn ${isPlaying ? 'passions__preview-btn--playing' : ''}`}
                onClick={() => toggleSong(song.id)}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ── Readwise widget ─────────────────────────────────────────────── */
function ReadwiseWidget() {
  const { highlights: allHighlights, loading, error } = useReadwise()
  const highlights = allHighlights.slice(0, 5)
  const [current, setCurrent] = useState(0)

  // Auto-float: cycle through highlights every 8 s
  useEffect(() => {
    if (highlights.length < 2) return
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % highlights.length)
    }, 8000)
    return () => clearInterval(id)
  }, [highlights.length - 1])

  return (
    <div className="passions__widget">
      <div className="passions__widget-header">
        <ReadwiseIcon />
        <span className="passions__widget-title">Daily Review</span>
      </div>

      {loading && (
        <div className="passions__skeleton-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="passions__skeleton-row">
              <div className="passions__skeleton-lines" style={{ width: '100%' }}>
                <div className="passions__skeleton passions__skeleton--title" style={{ width: '90%' }} />
                <div className="passions__skeleton passions__skeleton--title" style={{ width: '75%' }} />
                <div className="passions__skeleton passions__skeleton--sub"   style={{ width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="passions__error">Could not load highlights — check your Readwise token.</p>}

      {!loading && !error && highlights.length > 0 && (
        <>
          <div className="passions__highlight-carousel">
            {highlights.map((h, i) => (
              <div
                key={h.id}
                className={`passions__highlight ${i === current ? 'passions__highlight--active' : ''}`}
              >
                <blockquote className="passions__highlight-text">"{h.text}"</blockquote>
                <div className="passions__highlight-meta">
                  {h.cover_image_url
                    ? <img
                        src={h.cover_image_url}
                        alt={h.title}
                        className={`passions__highlight-cover ${h.is_book ? 'passions__highlight-cover--book' : 'passions__highlight-cover--logo'}`}
                      />
                    : <span className="passions__highlight-cover-slot" />
                  }
                  <div>
                    <p className="passions__highlight-title">{h.title}</p>
                    {h.author && <p className="passions__highlight-author">{h.author}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot navigation */}
          <div className="passions__dots">
            {highlights.map((_, i) => (
              <button
                key={i}
                className={`passions__dot ${i === current ? 'passions__dot--active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Passions() {
  return (
    <section className="section section--passions">
      <div className="passions__blob passions__blob--1" />
      <div className="passions__blob passions__blob--2" />

      <div className="passions__container">
        <div className="passions__header">
          <p className="passions__eyebrow">Beyond the Code</p>
          <h2 className="passions__title">What's On My Mind</h2>
          <p className="passions__subtitle">
            All the interesting things I do beyond writing code.
          </p>
        </div>

        <div className="passions__widgets">
          <YoutubeWidget  />
          <ReadwiseWidget />
        </div>
      </div>
    </section>
  )
}

/* ── Icons ───────────────────────────────────────────────────────── */
function MusicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  )
}

function ReadwiseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21"/>
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
  )
}
