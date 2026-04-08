import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './Header.css'

type Section = 'about' | 'work' | 'passions' | 'contact'

interface HeaderProps {
  active: Section
  onNavigate: (s: Section) => void
}

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'about',    label: 'About'      },
  { id: 'work',     label: 'Work'       },
  { id: 'passions', label: 'Passions'   },
  { id: 'contact',  label: 'Contact Me' },
]

// Tape: K K A L Y A N — window [frame, frame+1] slides right one step at a time
const TAPE = 'KKALYAN'

function LogoButton({ onClick }: { onClick: () => void }) {
  const [frame, setFrame]     = useState(0)
  const [sliding, setSliding] = useState(false)
  const [slotW, setSlotW]     = useState(0)
  const buttonRef  = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoveringRef = useRef(false)

  const c0 = TAPE[frame % TAPE.length]
  const c1 = TAPE[(frame + 1) % TAPE.length]
  const c2 = TAPE[(frame + 2) % TAPE.length]

  // Measure slot width and re-measure whenever the viewport resizes
  useLayoutEffect(() => {
    const btn = buttonRef.current
    if (!btn) return

    function measure() {
      const spans = btn!.querySelectorAll<HTMLSpanElement>('.header__logo-char')
      if (spans.length >= 2) {
        setSlotW(
          spans[1].getBoundingClientRect().left - spans[0].getBoundingClientRect().left
        )
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [])

  function scheduleNext() {
    timeoutRef.current = setTimeout(() => {
      if (hoveringRef.current) setSliding(true)
    }, 180) // pause between slides
  }

  // When the slide animation ends: snap back instantly then schedule the next one
  function onTransitionEnd() {
    setFrame(f => (f + 1) % TAPE.length)
    setSliding(false)
    scheduleNext()
  }

  function startCycle() {
    if (hoveringRef.current) return
    hoveringRef.current = true
    scheduleNext()
  }

  function stopCycle() {
    hoveringRef.current = false
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    setSliding(false)
    setFrame(0)
  }

  useEffect(() => () => { stopCycle() }, [])

  return (
    <button
      ref={buttonRef}
      className="header__logo"
      onClick={onClick}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      style={slotW ? { width: `${slotW * 2}px` } : undefined}
    >
      <div
        className="header__logo-track"
        style={{
          transform:  sliding && slotW ? `translateX(-${slotW}px)` : 'translateX(0)',
          transition: sliding ? 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <span className="header__logo-char">{c0}</span>
        <span className="header__logo-char">{c1}</span>
        <span className="header__logo-char">{c2}</span>
      </div>
    </button>
  )
}

export default function Header({ active, onNavigate }: HeaderProps) {
  const accentClass =
    active === 'about'    ? 'header--about'    :
    active === 'work'     ? 'header--work'     :
    active === 'passions' ? 'header--passions' :
                            'header--contact'

  return (
    <header className={`header ${accentClass} header--visible`}>
      <div className="header__inner">
        <LogoButton onClick={() => onNavigate('about')} />

        <nav className="header__nav">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              className={`header__nav-item ${active === id ? 'header__nav-item--active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              {label}
              <span className="header__nav-indicator" />
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
