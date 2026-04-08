import { useState, useEffect, useRef } from 'react'
import { useReadwise } from '../hooks/useReadwise'
import { useUnsplash } from '../hooks/useUnsplash'
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

/* ── Unsplash photography widget ─────────────────────────────────── */
function UnsplashWidget() {
  const { photos, loading, error } = useUnsplash()
  const username = import.meta.env.VITE_UNSPLASH_USERNAME as string | undefined

  return (
    <div className="passions__widget passions__widget--full">
      <div className="passions__widget-header">
        <CameraIcon />
        <span className="passions__widget-title">My Photography</span>
        {username && (
          <a
            href={`https://unsplash.com/@${username}`}
            target="_blank"
            rel="noreferrer"
            className="passions__unsplash-link"
          >
            @{username} on Unsplash ↗
          </a>
        )}
      </div>

      {loading && (
        <div className="passions__photo-skeleton-row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="passions__skeleton passions__photo-skeleton" />
          ))}
        </div>
      )}

      {error && (
        <p className="passions__error">
          Could not load photos — add <code>VITE_UNSPLASH_ACCESS_KEY</code> and{' '}
          <code>VITE_UNSPLASH_USERNAME</code> to your <code>.env</code>.
        </p>
      )}

      {!loading && !error && (
        <div className="passions__photo-strip">
          {photos.map(photo => {
            const displayW = Math.round(220 * photo.width / photo.height)
            const caption  = photo.description ?? photo.alt_description ?? ''
            return (
              <a
                key={photo.id}
                href={photo.links.html}
                target="_blank"
                rel="noreferrer"
                className="passions__photo-item"
                style={{ width: `${displayW}px` }}
                title={caption}
              >
                <img
                  src={photo.urls.small}
                  alt={caption}
                  className="passions__photo-img"
                  loading="lazy"
                />
                {caption && (
                  <div className="passions__photo-overlay">
                    <span className="passions__photo-caption">{caption}</span>
                  </div>
                )}
              </a>
            )
          })}
        </div>
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

        <UnsplashWidget />
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

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
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
