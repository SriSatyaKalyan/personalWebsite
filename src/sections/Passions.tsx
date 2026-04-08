import { useState, useEffect } from 'react'
import { useSpotify }  from '../hooks/useSpotify'
import { useReadwise } from '../hooks/useReadwise'
import './Passions.css'

/* ── Spotify widget ──────────────────────────────────────────────── */
function SpotifyWidget() {
  const { tracks, loading, error } = useSpotify()

  return (
    <div className="passions__widget">
      <div className="passions__widget-header">
        <SpotifyIcon />
        <span className="passions__widget-title">Top 5 Right Now</span>
      </div>

      {loading && (
        <div className="passions__skeleton-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="passions__skeleton-row">
              <div className="passions__skeleton passions__skeleton--art" />
              <div className="passions__skeleton-lines">
                <div className="passions__skeleton passions__skeleton--title" />
                <div className="passions__skeleton passions__skeleton--sub" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="passions__error">Could not load tracks — check your Spotify token.</p>}

      {!loading && !error && (
        <ol className="passions__track-list">
          {tracks.map((track, i) => (
            <li key={track.id} className="passions__track">
              <span className="passions__track-rank">{i + 1}</span>
              <img
                src={track.albumArt}
                alt={track.album}
                className="passions__track-art"
              />
              <div className="passions__track-info">
                <a
                  href={track.url}
                  target="_blank"
                  rel="noreferrer"
                  className="passions__track-name"
                >
                  {track.name}
                </a>
                <span className="passions__track-artist">
                  {track.artists.join(', ')}
                </span>
              </div>
              {track.previewUrl && (
                <AudioPreview url={track.previewUrl} />
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/* ── 30-second audio preview button ─────────────────────────────── */
function AudioPreview({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const [audio]  = useState(() => {
    const a = new Audio(url)
    a.volume = 0.4
    return a
  })

  useEffect(() => {
    audio.onended = () => setPlaying(false)
    return () => { audio.pause() }
  }, [audio])

  function toggle() {
    if (playing) { audio.pause(); audio.currentTime = 0; setPlaying(false) }
    else         { audio.play();  setPlaying(true) }
  }

  return (
    <button className={`passions__preview-btn ${playing ? 'passions__preview-btn--playing' : ''}`} onClick={toggle} title="Preview">
      {playing ? <PauseIcon /> : <PlayIcon />}
    </button>
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
                  {h.cover_image_url && (
                    <img
                      src={h.cover_image_url}
                      alt={h.title}
                      className={`passions__highlight-cover ${h.is_book ? 'passions__highlight-cover--book' : 'passions__highlight-cover--logo'}`}
                    />
                  )}
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
          <SpotifyWidget  />
          <ReadwiseWidget />
        </div>
      </div>
    </section>
  )
}

/* ── Icons ───────────────────────────────────────────────────────── */
function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
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
