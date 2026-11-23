import { useEffect, useRef } from 'react'
import { brand, nav } from '../data/site.js'
import styles from './MobileMenu.module.css'

export default function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    if (!open) return

    panelRef.current?.querySelector('a')?.focus({ preventScroll: true })
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [open, onClose])

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      className={`${styles.panel} ${open ? styles.open : ''}`}
      inert={!open}
      aria-hidden={!open}
    >
      <nav className={styles.links} aria-label="Mobile">
        {nav.map((item, i) => (
          <a key={item.href} href={item.href} onClick={onClose} style={{ '--i': i }}>
            <span className={styles.num}>0{i + 1}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className={styles.foot} style={{ '--i': nav.length }}>
        <a href={`mailto:${brand.email}`}>{brand.email}</a>
        <div className={styles.social}>
          {brand.social.map((s) => (
            <a key={s.label} href={s.href}>{s.label}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
