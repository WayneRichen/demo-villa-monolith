import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { villas } from '../data/site.js'
import { useReveal } from '../hooks/useReveal.js'
import styles from './Collection.module.css'

const SWIPE_THRESHOLD = 60 // px of drag needed to change slide
const pad = (n) => String(n).padStart(2, '0')
const money = (n) => `€${n.toLocaleString('en-US')}`

/** Lets other sections (Reservation) know which villa was chosen. */
export const selectVilla = (id) => window.dispatchEvent(new CustomEvent('monolith:select-villa', { detail: id }))

export default function Collection() {
  const root = useRef(null)
  const viewport = useRef(null)
  const track = useRef(null)
  const [index, setIndex] = useState(0)
  const [offsets, setOffsets] = useState([])
  const drag = useRef({ active: false, startX: 0, startY: 0, dx: 0, locked: null, moved: false })

  useReveal(root)

  const count = villas.length
  const go = useCallback((i) => setIndex(Math.max(0, Math.min(count - 1, i))), [count])

  // Measure where each card should sit, clamped so the track never over-scrolls.
  const measure = useCallback(() => {
    const t = track.current
    const v = viewport.current
    if (!t || !v) return
    const cards = [...t.children]
    const first = cards[0].offsetLeft
    const last = cards[cards.length - 1]
    const padRight = parseFloat(getComputedStyle(t).paddingRight) || 0
    const max = Math.max(0, last.offsetLeft + last.offsetWidth + padRight - v.clientWidth)
    setOffsets(cards.map((c) => Math.min(c.offsetLeft - first, max)))
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewport.current)
    return () => ro.disconnect()
  }, [measure])

  const setTranslate = useCallback(
    (dx = 0) => {
      const x = -(offsets[index] ?? 0) + dx
      track.current.style.transform = `translate3d(${x}px, 0, 0)`
    },
    [offsets, index],
  )

  useEffect(() => setTranslate(0), [setTranslate])

  // ----- Pointer drag / swipe -----
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, dx: 0, locked: null, moved: false }
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    // Decide once whether this gesture is horizontal (carousel) or vertical (page scroll).
    if (d.locked === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      d.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (d.locked === 'x') {
        viewport.current.setPointerCapture(e.pointerId)
        track.current.classList.add(styles.dragging)
      }
    }
    if (d.locked !== 'x') return
    // Resist at the ends.
    const atEdge = (index === 0 && dx > 0) || (index === count - 1 && dx < 0)
    d.dx = atEdge ? dx * 0.3 : dx
    d.moved = true
    setTranslate(d.dx)
  }

  const onPointerUp = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    track.current.classList.remove(styles.dragging)
    if (d.locked !== 'x') return
    if (d.dx < -SWIPE_THRESHOLD) go(index + 1)
    else if (d.dx > SWIPE_THRESHOLD) go(index - 1)
    else setTranslate(0)
  }

  // Swallow the click that follows a drag so links don't fire accidentally.
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) }
  }

  return (
    <section id="collection" ref={root} className={styles.collection}>
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" data-reveal="up">
              <span className="eyebrow-num">(02)</span> The Collection
            </p>
            <h2 data-reveal="lines">Three houses,<br />three landscapes</h2>
          </div>

          <div className={styles.controls} data-reveal="up">
            <p className={styles.counter} aria-live="polite">
              <span>{pad(index + 1)}</span> / {pad(count)}
            </p>
            <div className={styles.arrows}>
              <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous villa">
                <Arrow dir="left" />
              </button>
              <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Next villa">
                <Arrow />
              </button>
            </div>
          </div>
        </header>
      </div>

      <div
        ref={viewport}
        className={styles.viewport}
        role="region"
        aria-roledescription="carousel"
        aria-label="Villa collection"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        <ol ref={track} className={styles.track}>
          {villas.map((v, i) => (
            <li
              key={v.id}
              className={`${styles.card} ${i === index ? styles.active : ''}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${v.name}`}
              onClick={() => i !== index && go(i)}
            >
              <figure className={`zoom ${styles.media}`}>
                <img src={v.image.src} width={v.image.width} height={v.image.height} alt={v.image.alt} loading="lazy" draggable="false" />
                <figcaption className={styles.tag}>
                  {v.location}<br />{v.country}
                </figcaption>
              </figure>

              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <span className={styles.num}>{pad(i + 1)}</span>
                  <h3>{v.name}</h3>
                </div>
                <p className={styles.summary}>{v.summary}</p>

                <dl className={styles.specs}>
                  <div><dt>Size</dt><dd>{v.size} m²</dd></div>
                  <div><dt>Suites</dt><dd>{v.suites}</dd></div>
                  <div><dt>Guests</dt><dd>Up to {v.guests}</dd></div>
                  <div><dt>From</dt><dd>{money(v.price)} / night</dd></div>
                </dl>

                <a
                  href="#reservation"
                  className={`link-line ${styles.more}`}
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => selectVilla(v.id)}
                >
                  Reserve {v.name} <Arrow />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="container">
        <div className={styles.progress} aria-hidden="true">
          <span style={{ transform: `scaleX(${(index + 1) / count})` }} />
        </div>
      </div>
    </section>
  )
}

function Arrow({ dir = 'right' }) {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true"
      style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M0 5h21M17 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
