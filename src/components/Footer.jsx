import { useRef, useState } from 'react'
import { brand, footerLinks } from '../data/site.js'
import { useReveal } from '../hooks/useReveal.js'
import styles from './Footer.module.css'

export default function Footer() {
  const root = useRef(null)
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | error | done

  useReveal(root)

  const subscribe = (e) => {
    e.preventDefault()
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? 'done' : 'error')
  }

  return (
    <footer ref={root} className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.newsletter}>
            <p className={styles.lead} data-reveal="up">
              Letters from the houses — a few times a year, never more.
            </p>
            {state === 'done' ? (
              <p className={styles.thanks} role="status">Thank you. You’re on the list.</p>
            ) : (
              <form className={styles.form} onSubmit={subscribe} noValidate data-reveal="up">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setState('idle') }}
                  aria-invalid={state === 'error'}
                  aria-describedby={state === 'error' ? 'newsletter-err' : undefined}
                />
                <button type="submit" aria-label="Subscribe">
                  <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true">
                    <path d="M0 5h21M17 1l4 4-4 4" stroke="currentColor" />
                  </svg>
                </button>
                {state === 'error' && <span id="newsletter-err" className={styles.error} role="alert">Enter a valid email address.</span>}
              </form>
            )}
          </div>

          <div className={styles.cols} data-reveal="stagger">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <p className={styles.colTitle}>{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}><a href={l.href} className="link-line">{l.label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className={styles.colTitle}>Contact</p>
              <ul>
                <li><a href={`mailto:${brand.email}`} className="link-line">{brand.email}</a></li>
                <li><a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="link-line">{brand.phone}</a></li>
                {brand.address.map((line) => <li key={line} className={styles.muted}>{line}</li>)}
              </ul>
            </div>
            <div>
              <p className={styles.colTitle}>Follow</p>
              <ul>
                {brand.social.map((s) => (
                  <li key={s.label}><a href={s.href} className="link-line">{s.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className={styles.wordmark} aria-hidden="true" data-reveal="up">{brand.name}</p>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} {brand.name}. A portfolio concept — not a real business.</p>
          <p>Photography via Unsplash</p>
          <a href="#top" className="link-line">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
