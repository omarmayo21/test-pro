import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { site } from '../data/site'

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('menu-is-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('menu-is-open')
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <div className="header-inner page-shell">
          <a className="brand-lockup" href="#top" aria-label={`${site.name}, home`} onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">MA</span>
            <span className="brand-name">MOHAMED<br />ASHRAF</span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>

          <a className="header-cta" href="#contact">
            <span>Start a project</span>
            <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            id="mobile-navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu__meta"><span>MOHAMED ASHRAF</span><span>MENU / 01—04</span></div>
            <nav aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <a key={item.href} href={item.href} onClick={closeMenu}>
                  <span className="mobile-menu__index">0{index + 1}</span>
                  <span>{item.label}</span>
                  <ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" />
                </a>
              ))}
            </nav>
            <p>Senior graphic designer<br />Helping brands look bold, clear, and consistent.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
