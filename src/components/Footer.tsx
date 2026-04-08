
import './Footer.css'

type Section = 'about' | 'work' | 'contact'

interface FooterProps {
  active: Section
}

export default function Footer({ active }: FooterProps) {
  return (
    <footer className={`footer footer--${active}`}>
      <p className="footer__text">
        Made with <span className="footer__heart">♥</span> by Kalyan
      </p>
    </footer>
  )
}
