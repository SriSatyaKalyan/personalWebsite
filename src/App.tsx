import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import About    from './sections/About'
import Work     from './sections/Work'
import Passions from './sections/Passions'
import Contact  from './sections/Contact'
import './App.css'

type Section = 'about' | 'work' | 'passions' | 'contact'

export default function App() {
  const [active, setActive]   = useState<Section>('about')
  const [visible, setVisible] = useState<Section>('about')
  const [animating, setAnimating] = useState(false)

  function navigate(next: Section) {
    if (next === active || animating) return
    setAnimating(true)

    setTimeout(() => {
      setVisible(next)
      setActive(next)
      window.scrollTo({ top: 0 })
    }, 280)

    setTimeout(() => setAnimating(false), 580)
  }

  // Keyboard navigation (← →)
  useEffect(() => {
    const order: Section[] = ['about', 'work', 'passions', 'contact']
    function onKey(e: KeyboardEvent) {
      const idx = order.indexOf(active)
      if (e.key === 'ArrowRight' && idx < order.length - 1) navigate(order[idx + 1])
      if (e.key === 'ArrowLeft'  && idx > 0)                navigate(order[idx - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, animating])

  return (
    <div className={`app app--${active}`}>
      <Header active={active} onNavigate={navigate} />

      <main className={`app__main ${animating ? 'app__main--exit' : 'app__main--enter'}`}>
        {visible === 'about'    && <About    />}
        {visible === 'work'     && <Work     />}
        {visible === 'passions' && <Passions />}
        {visible === 'contact'  && <Contact  />}
      </main>

      <Footer active={active} />
    </div>
  )
}
