import { useEffect, useRef, useState } from 'react'
import { gallery } from '../data/site.js'
import { useReveal } from '../hooks/useReveal.js'
import styles from './Gallery.module.css'

export default function Gallery() {
  const root = useRef(null)
  const dialog = useRef(null)
  const [current, setCurrent] = useState(null) // index of open image, or null

  useReveal(root)

  const count = gallery.length
  const open = (i) => setCurrent(i)
  const close = () => setCurrent(null)
  const step = (d) => setCurrent((c) => (c + d + count) % count)

  // Sync React state with the native <dialog> (focus trap + Esc come for free).
  useEffect(() => {
    const d = dialog.current
    if (current !== null && !d.open) {
      d.showModal()
      document.body.classList.add('is-locked')
    } else if (current === null && d.open) {
      d.close()
    }
  }, [current])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }

  const item = current !== null ? gallery[current] : null

  return (
    <section id="gallery" ref={root} className={styles.gallery}>
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" data-reveal="up">
              <span className="eyebrow-num">(04)</span> Gallery
            </p>
            <h2 data-reveal="lines">Stone, light<br />&amp; quiet rooms</h2>
          </div>
          <p className={styles.note} data-reveal="up">Select an image to view it full screen.</p>
        </header>

        <ul className={styles.grid}>
          {gallery.map((g, i) => (
            <li key={g.src} className={styles.item} data-reveal="up">
              <button type="button" className={styles.thumb} onClick={() => open(i)} aria-label={`View image: ${g.caption}`}>
                <span className="zoom">
                  <img src={g.src} width={g.width} height={g.height} alt={g.alt} loading="lazy" />
                </span>
                <span className={styles.caption}>{g.caption}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label="Image viewer"
        onClose={() => { setCurrent(null); document.body.classList.remove('is-locked') }}
        onKeyDown={onKeyDown}
        onClick={(e) => e.target === dialog.current && close()}
      >
        {item && (
          <>
            <figure className={styles.lbFigure} onClick={(e) => e.target === e.currentTarget && close()}>
              <img key={item.src} src={item.src} width={item.width} height={item.height} alt={item.alt} />
              <figcaption>
                <span>{String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
                {item.caption}
              </figcaption>
            </figure>
            <button type="button" className={styles.lbClose} onClick={close} aria-label="Close viewer">Close</button>
            <button type="button" className={`${styles.lbNav} ${styles.lbPrev}`} onClick={() => step(-1)} aria-label="Previous image">Prev</button>
            <button type="button" className={`${styles.lbNav} ${styles.lbNext}`} onClick={() => step(1)} aria-label="Next image">Next</button>
          </>
        )}
      </dialog>
    </section>
  )
}
