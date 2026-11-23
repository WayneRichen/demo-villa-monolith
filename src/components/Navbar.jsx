import { useCallback, useEffect, useState } from 'react'
import { brand, nav } from '../data/site.js'
import MobileMenu from './MobileMenu.jsx'
import styles from './Navbar.module.css'

const SCROLL_THRESHOLD = 40

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 961px)')
    const onChange = (e) => e.matches && setMenuOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const cls = [styles.nav, scrolled && styles.scrolled, menuOpen && styles.menuOpen].filter(Boolean).join(' ')

  return (
    <header className={cls}>
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label={`${brand.name} — back to top`}>
          {brand.name}
        </a>

        <nav className={styles.links} aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="link-line">
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#reservation" className={styles.cta}>
          Reserve
        </a>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  )
}
