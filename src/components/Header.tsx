import './Header.css'

type Section = 'about' | 'work' | 'contact'

interface HeaderProps {
  active: Section
  onNavigate: (s: Section) => void
}

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'about',   label: 'About'      },
  { id: 'work',    label: 'Work'       },
  { id: 'contact', label: 'Contact Me' },
]

export default function Header({ active, onNavigate }: HeaderProps) {
  const accentClass =
    active === 'about'   ? 'header--about'   :
    active === 'work'    ? 'header--work'     :
                           'header--contact'

  return (
    <header className={`header ${accentClass} header--visible`}>
      <div className="header__inner">
        <button
          className="header__logo"
          onClick={() => onNavigate('about')}
        >
          KK
        </button>

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
