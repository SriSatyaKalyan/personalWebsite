import './LaptopScene.css'

type Section = 'about' | 'work' | 'passions' | 'contact'

const ACCENT: Record<Section, string> = {
  about:    '#e03030',
  work:     '#9333ea',
  passions: '#38bdf8',
  contact:  '#f97316',
}

interface Props { section: Section; animating: boolean }

export default function LaptopScene({ section, animating }: Props) {
  const color = ACCENT[section]
  const sid   = section // used for unique SVG gradient IDs

  return (
    <div className={`lscene lscene--${section}${animating ? ' lscene--out' : ''}`} aria-hidden="true">
      <svg className="lscene__svg" viewBox="0 0 880 600" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* ── Shared gradient defs ─────────────────────────── */}
        <defs>
          <radialGradient id={`${sid}-sg`} cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* ════════════════════════════════════════════════════
            LID  –  screen + bezel
            For About: CSS scaleY from hinge point simulates opening
        ════════════════════════════════════════════════════ */}
        <g className="lscene__lid">

          {/* Outer bezel */}
          <rect x="60" y="12" width="760" height="460" rx="18"
                fill="#050505" stroke={color} strokeWidth="1.5" strokeOpacity="0.28" />

          {/* Display area */}
          <rect x="82" y="34" width="716" height="416" rx="6" fill="#020202" />

          {/* Ambient screen glow */}
          <rect x="82" y="34" width="716" height="416" fill={`url(#${sid}-sg)`} />

          {/* Camera + status LED */}
          <circle cx="440" cy="23" r="4.5" fill={color} fillOpacity="0.28" />
          <circle cx="440" cy="23" r="2"   fill={color} fillOpacity="0.8"  />
          <circle cx="456" cy="23" r="2"   fill={color} fillOpacity="0.18" />

          {/* Per-section screen content */}
          {section === 'about'    && <AboutScreen    color={color} sid={sid} />}
          {section === 'work'     && <WorkScreen     color={color} />}
          {section === 'passions' && <PassionsScreen color={color} sid={sid} />}
          {section === 'contact'  && <ContactScreen  color={color} />}
        </g>

        {/* ════════════════════════════════════════════════════
            BASE  –  keyboard rows + trackpad
        ════════════════════════════════════════════════════ */}
        <g className="lscene__base">

          {/* Hinge bar */}
          <rect x="180" y="472" width="520" height="8" rx="4"
                fill={color} fillOpacity="0.07" />

          {/* Body */}
          <rect x="14" y="482" width="852" height="112" rx="14"
                fill="#050505" stroke={color} strokeWidth="1.5" strokeOpacity="0.2" />

          {/* Keyboard rows (5 stripes) */}
          {[496, 512, 528, 544, 560].map(y => (
            <rect key={y} x="30" y={y} width="820" height="9" rx="4"
                  fill={color} fillOpacity="0.07" />
          ))}

          {/* Trackpad */}
          <rect x="348" y="492" width="184" height="84" rx="10"
                fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.18" />
          <line x1="348" y1="553" x2="532" y2="553"
                stroke={color} strokeWidth="0.5" strokeOpacity="0.14" />
        </g>
      </svg>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ABOUT  –  macOS-style desktop with "Hello." text
   The whole lid group does a scaleY open/close animation.
══════════════════════════════════════════════════════════════ */
function AboutScreen({ color, sid }: { color: string; sid: string }) {
  const dockItems = [306, 344, 382, 420, 458, 496, 534, 572]
  return (
    <g>
      <defs>
        <radialGradient id={`${sid}-wp`} cx="42%" cy="55%" r="65%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* Desktop wallpaper glow */}
      <rect x="82" y="34" width="716" height="416" fill={`url(#${sid}-wp)`} />

      {/* Menu bar */}
      <rect x="82" y="34" width="716" height="22" fill={color} fillOpacity="0.05" />
      <circle cx="100" cy="45" r="4.5" fill={color} fillOpacity="0.4"  />
      <circle cx="116" cy="45" r="4.5" fill={color} fillOpacity="0.24" />
      <circle cx="132" cy="45" r="4.5" fill={color} fillOpacity="0.14" />
      {/* Menu items */}
      {[180, 224, 268, 310].map(x => (
        <rect key={x} x={x} y="40" width="36" height="10" rx="3"
              fill={color} fillOpacity="0.12" />
      ))}

      {/* Center soft glow */}
      <ellipse cx="440" cy="242" rx="200" ry="150" fill={color} fillOpacity="0.05" />

      {/* "Hello." greeting */}
      <text x="440" y="234" textAnchor="middle"
            fill={color} fillOpacity="0.55"
            fontSize="74" fontFamily="Space Grotesk, sans-serif" fontWeight="300"
            letterSpacing="8">
        Welcome
      </text>

      {/* Blinking cursor */}
      <rect x="438" y="256" width="3" height="36"
            fill={color} fillOpacity="0.75" className="lscene__cursor" />

      {/* Dock */}
      <rect x="272" y="413" width="336" height="30" rx="13"
            fill={color} fillOpacity="0.07"
            stroke={color} strokeWidth="0.8" strokeOpacity="0.2" />
      {dockItems.map(x => (
        <rect key={x} x={x - 12} y="418" width="24" height="20" rx="6"
              fill={color} fillOpacity="0.14" />
      ))}
    </g>
  )
}

/* ══════════════════════════════════════════════════════════════
   WORK  –  code editor (VS Code-style)
══════════════════════════════════════════════════════════════ */
function WorkScreen({ color }: { color: string }) {
  // [indent×6px, barWidth, fill-color, opacity]
  const lines: [number, number, string, number][] = [
    [0,  164, '#c084fc', 0.55],
    [0,  298, '#e2e8f0', 0.42],
    [0,    0, '',        0   ],
    [0,  148, '#c084fc', 0.55],
    [20, 316, '#e2e8f0', 0.42],
    [40, 208, '#86efac', 0.5 ],
    [40, 262, '#e2e8f0', 0.42],
    [40, 176, '#475569', 0.32],
    [20, 284, '#e2e8f0', 0.42],
    [0,   34, '#94a3b8', 0.5 ],
    [0,    0, '',        0   ],
    [0,  148, '#c084fc', 0.55],
    [20, 238, '#86efac', 0.5 ],
    [20, 306, '#e2e8f0', 0.42],
    [0,   34, '#94a3b8', 0.5 ],
  ]
  const gx = 136   // code x start (after line-number gutter)
  const sy = 70    // first row y
  const rh = 22    // row height

  return (
    <g>
      {/* Editor bg */}
      <rect x="82" y="34" width="716" height="416" fill="#0c0c18" />

      {/* Tab bar */}
      <rect x="82" y="34" width="716" height="28" fill="#090912" />
      <rect x="98"  y="39" width="112" height="19" rx="4" fill={color} fillOpacity="0.13" />
      <text x="112" y="52.5" fill={color} fillOpacity="0.6" fontSize="11" fontFamily="monospace">app.ts</text>
      <circle cx="205" cy="48.5" r="3" fill={color} fillOpacity="0.5" />
      <text x="222"  y="52.5" fill={color} fillOpacity="0.26" fontSize="11" fontFamily="monospace">utils.ts</text>

      {/* Line numbers */}
      {lines.map((_, i) => (
        <text key={i} x="124" y={sy + i * rh + 12}
              textAnchor="end" fill="#2a2a46" fontSize="11" fontFamily="monospace">
          {i + 1}
        </text>
      ))}

      {/* Code bars */}
      {lines.map(([indent, width, lineColor, op], i) =>
        width > 0 ? (
          <rect key={i}
                x={gx + indent * 6} y={sy + i * rh}
                width={width} height="13" rx="3"
                fill={lineColor} fillOpacity={op} />
        ) : null
      )}

      {/* Active-line highlight */}
      <rect x="82" y={sy + 11 * rh - 2} width="716" height="19"
            fill={color} fillOpacity="0.045" />

      {/* Blinking cursor */}
      <rect x={gx + 20 * 6 + 238 + 4}
            y={sy + 11 * rh + 1}
            width="2" height="14"
            fill={color} className="lscene__cursor" />

      {/* Status bar */}
      <rect x="82" y="432" width="716" height="18" fill={color} fillOpacity="0.07" />
      <text x="96"  y="444.5" fill={color} fillOpacity="0.38" fontSize="10" fontFamily="monospace">TypeScript  ●  no errors</text>
      <text x="792" y="444.5" textAnchor="end" fill={color} fillOpacity="0.38" fontSize="10" fontFamily="monospace">Ln 12, Col 44</text>
    </g>
  )
}

/* ══════════════════════════════════════════════════════════════
   PASSIONS  –  music player with equalizer + waveform
══════════════════════════════════════════════════════════════ */
function PassionsScreen({ color, sid }: { color: string; sid: string }) {
  // Max bar height 80px so bars sit comfortably in the bottom strip of the screen
  // Screen bottom = y 450; bar base sits at y 440 to leave a small margin
  const BAR_BASE = 438
  const MAX_BH   = 80
  const barH = [38, 72, 58, 88, 52, 94, 62, 78, 46, 84, 68, 52, 76, 90, 55]
  const wAmp  = [12,22,36,28,44,30,18,38,52,34,42,26,48,32,16,38,56,40,28,44,
                 20,34,50,38,24,42,60,38,26,46,22,36,54,42,28,48,30,18,40,58,
                 36,24,44,26,38,52,28,16,36,20]

  const wavePoints = wAmp
    .map((a, i) => `${82 + i * (716 / (wAmp.length - 1))},${290 - a}`)
    .join(' ')

  return (
    <g>
      <defs>
        <linearGradient id={`${sid}-pp`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.14" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
        {/* Clip to screen bounds so nothing bleeds outside */}
        <clipPath id={`${sid}-sc`}>
          <rect x="82" y="34" width="716" height="416" rx="6" />
        </clipPath>
      </defs>

      {/* BG */}
      <rect x="82" y="34"  width="716" height="416" fill="#020c14" />
      <rect x="82" y="34"  width="716" height="240" fill={`url(#${sid}-pp)`} />

      {/* Album art */}
      <rect x="108" y="58" width="166" height="166" rx="14"
            fill={color} fillOpacity="0.08"
            stroke={color} strokeWidth="1" strokeOpacity="0.26" />
      {[62, 42, 22, 8].map(r => (
        <circle key={r} cx="191" cy="141" r={r}
                fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.16" />
      ))}
      <circle cx="191" cy="141" r="6" fill={color} fillOpacity="0.35" />

      {/* Song meta */}
      <rect x="296" y="76"  width="262" height="16" rx="4" fill={color} fillOpacity="0.5"  />
      <rect x="296" y="102" width="190" height="12" rx="4" fill={color} fillOpacity="0.28" />
      <rect x="296" y="122" width="132" height="10" rx="4" fill={color} fillOpacity="0.16" />

      {/* Progress bar */}
      <rect x="296" y="164" width="460" height="3" rx="2" fill={color} fillOpacity="0.16" />
      <rect x="296" y="164" width="202" height="3" rx="2" fill={color} fillOpacity="0.76" />
      <circle cx="498" cy="165.5" r="5.5" fill={color} fillOpacity="0.9" />
      <text x="296" y="182" fill={color} fillOpacity="0.36" fontSize="10" fontFamily="monospace">1:42</text>
      <text x="756" y="182" textAnchor="end" fill={color} fillOpacity="0.36" fontSize="10" fontFamily="monospace">3:58</text>

      {/* Controls — prev / pause / next */}
      <path d="M 376,214 L 362,222 L 376,230 Z" fill={color} fillOpacity="0.46" />
      <line x1="360" y1="214" x2="360" y2="230" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.46" />

      <circle cx="440" cy="222" r="19" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1" strokeOpacity="0.38" />
      <rect x="433" y="213" width="5" height="18" rx="2" fill={color} fillOpacity="0.72" />
      <rect x="442" y="213" width="5" height="18" rx="2" fill={color} fillOpacity="0.72" />

      <path d="M 504,214 L 518,222 L 504,230 Z" fill={color} fillOpacity="0.46" />
      <line x1="520" y1="214" x2="520" y2="230" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.46" />

      {/* Waveform */}
      <polyline points={wavePoints} fill="none"
                stroke={color} strokeWidth="1.5" strokeOpacity="0.2" />

      {/* Equalizer bars — clipped to screen, no inline transformOrigin override */}
      <g clipPath={`url(#${sid}-sc)`}>
        {barH.map((h, i) => {
          const bw  = 32
          const gap = 716 / barH.length
          const bx  = 82 + i * gap + (gap - bw) / 2
          const bh  = (h / 100) * MAX_BH
          return (
            <rect key={i}
                  x={bx} y={BAR_BASE - bh} width={bw} height={bh} rx="4"
                  fill={color} fillOpacity="0.45"
                  className={`lscene__eq lscene__eq--${i % 5}`} />
          )
        })}
      </g>

      {/* Floating music notes */}
      <text x="692" y="94"  fill={color} fillOpacity="0.22" fontSize="34" className="lscene__note lscene__note--a">♫</text>
      <text x="112" y="258" fill={color} fillOpacity="0.16" fontSize="24" className="lscene__note lscene__note--b">♪</text>
      <text x="638" y="202" fill={color} fillOpacity="0.12" fontSize="20" className="lscene__note lscene__note--c">♩</text>
    </g>
  )
}

/* ══════════════════════════════════════════════════════════════
   CONTACT  –  clean Zoom-style video-call grid
   Two large tiles side-by-side, avatars only (no silhouettes),
   top-bar with REC + timer, bottom control bar.
══════════════════════════════════════════════════════════════ */
function ContactScreen({ color }: { color: string }) {
  // Tile layout: two equal tiles with a gap
  const tileY = 58, tileH = 300, tileW = 336, gap = 12
  const tile1X = 98, tile2X = tile1X + tileW + gap

  return (
    <g>
      {/* Screen BG */}
      <rect x="82" y="34" width="716" height="416" fill="#0a0600" />

      {/* ── Top bar ─────────────────────────────────────── */}
      <rect x="82" y="34" width="716" height="22" fill={color} fillOpacity="0.06" />
      {/* REC dot */}
      <circle cx="100" cy="45" r="5" fill="#ef4444" className="lscene__rec" />
      <text x="112" y="49.5" fill="#ef4444" fillOpacity="0.8" fontSize="10" fontFamily="monospace">REC</text>
      {/* Timer */}
      <text x="786" y="49.5" textAnchor="end"
            fill={color} fillOpacity="0.45" fontSize="11" fontFamily="monospace">12:34</text>
      {/* Participant count */}
      <text x="440" y="49.5" textAnchor="middle"
            fill={color} fillOpacity="0.3" fontSize="10" fontFamily="monospace">2 participants</text>

      {/* ── Tile 1 – other person ───────────────────────── */}
      <rect x={tile1X} y={tileY} width={tileW} height={tileH} rx="10"
            fill={color} fillOpacity="0.05"
            stroke={color} strokeWidth="1" strokeOpacity="0.18" />
      {/* Avatar circle */}
      <circle cx={tile1X + tileW / 2} cy={tileY + tileH / 2 - 20} r="52"
              fill={color} fillOpacity="0.12"
              stroke={color} strokeWidth="1.5" strokeOpacity="0.3" />
      {/* Initials placeholder bars */}
      <rect x={tile1X + tileW / 2 - 22} y={tileY + tileH / 2 - 32} width="44" height="14" rx="4"
            fill={color} fillOpacity="0.35" />
      <rect x={tile1X + tileW / 2 - 16} y={tileY + tileH / 2 - 12} width="32" height="10" rx="4"
            fill={color} fillOpacity="0.22" />
      {/* Name tag */}
      <rect x={tile1X + 10} y={tileY + tileH - 28} width="100" height="14" rx="4"
            fill={color} fillOpacity="0.2" />
      {/* Muted mic icon */}
      <circle cx={tile1X + tileW - 20} cy={tileY + tileH - 22} r="10"
              fill={color} fillOpacity="0.14" />
      <rect x={tile1X + tileW - 23} y={tileY + tileH - 28} width="6" height="10" rx="3"
            fill={color} fillOpacity="0.4" />

      {/* ── Tile 2 – self view ──────────────────────────── */}
      <rect x={tile2X} y={tileY} width={tileW} height={tileH} rx="10"
            fill={color} fillOpacity="0.04"
            stroke={color} strokeWidth="2" strokeOpacity="0.45" /> {/* active speaker border */}
      {/* Avatar circle */}
      <circle cx={tile2X + tileW / 2} cy={tileY + tileH / 2 - 20} r="52"
              fill={color} fillOpacity="0.14"
              stroke={color} strokeWidth="1.5" strokeOpacity="0.35" />
      {/* Initials placeholder bars */}
      <rect x={tile2X + tileW / 2 - 22} y={tileY + tileH / 2 - 32} width="44" height="14" rx="4"
            fill={color} fillOpacity="0.4" />
      <rect x={tile2X + tileW / 2 - 16} y={tileY + tileH / 2 - 12} width="32" height="10" rx="4"
            fill={color} fillOpacity="0.25" />
      {/* "You" name tag */}
      <rect x={tile2X + 10} y={tileY + tileH - 28} width="60" height="14" rx="4"
            fill={color} fillOpacity="0.25" />
      {/* Speaking indicator – pulsing ring */}
      <circle cx={tile2X + tileW / 2} cy={tileY + tileH / 2 - 20} r="60"
              fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.25"
              className="lscene__rec" />

      {/* ── Control bar ─────────────────────────────────── */}
      <rect x="82" y="390" width="716" height="60" fill={color} fillOpacity="0.06" />
      <line x1="82" y1="390" x2="798" y2="390" stroke={color} strokeWidth="0.8" strokeOpacity="0.15" />

      {/* Mute */}
      <circle cx="354" cy="420" r="20"
              fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" strokeOpacity="0.28" />
      <rect x="349" y="411" width="10" height="13" rx="5" fill={color} fillOpacity="0.5" />
      <path d="M 345,422 Q 345,432 359,432 Q 373,432 373,422"
            fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />

      {/* Camera */}
      <circle cx="398" cy="420" r="20"
              fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" strokeOpacity="0.28" />
      <rect x="390" y="413" width="14" height="11" rx="3"
            fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M 404,415 L 413,412 L 413,425 L 404,422 Z" fill={color} fillOpacity="0.5" />

      {/* Share screen */}
      <circle cx="442" cy="420" r="20"
              fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" strokeOpacity="0.28" />
      <rect x="434" y="413" width="16" height="12" rx="2"
            fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M 442,409 L 442,415 M 439,412 L 442,409 L 445,412"
            fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />

      {/* End call */}
      <circle cx="490" cy="420" r="20"
              fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.45" />
      <path d="M 479,420 Q 490,414 501,420"
            stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" />
      <line x1="479" y1="420" x2="481" y2="413" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" />
      <line x1="501" y1="420" x2="499" y2="413" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" />
    </g>
  )
}
