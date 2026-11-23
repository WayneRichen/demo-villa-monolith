import { useLayoutEffect, useRef } from 'react'
import { hero } from '../data/site.js'
import { gsap, MOTION_OK } from '../hooks/useReveal.js'
import styles from './Hero.module.css'

export default function Hero() {
  const root = useRef(null)
  const imgRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root.current)

    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })

      tl.fromTo(q(`.${styles.media}`), { autoAlpha: 0, scale: 1.14 }, { autoAlpha: 1, scale: 1, duration: 2.4, ease: 'power2.out' })
        .from(q(`.${styles.line} > span`), { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.5)
        .from(q('[data-hero-fade]'), { autoAlpha: 0, y: 20, duration: 1.2, stagger: 0.1 }, 0.9)

      // Gentle parallax on the photo while scrolling past the hero.
      gsap.to(q(`.${styles.parallax}`), {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Start once the image has loaded so it fades in rather than pops.
      const img = imgRef.current
      if (img.complete) tl.play()
      else {
        img.addEventListener('load', () => tl.play(), { once: true })
        img.addEventListener('error', () => tl.play(), { once: true })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="top" ref={root} className={styles.hero} aria-label="Introduction">
      <div className={styles.parallax}>
        <div className={styles.media}>
          <img
            ref={imgRef}
            src={hero.image.src}
            width={hero.image.width}
            height={hero.image.height}
            alt={hero.image.alt}
            fetchPriority="high"
          />
        </div>
      </div>
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.content}>
        <p className={`eyebrow ${styles.eyebrow}`} data-hero-fade>{hero.eyebrow}</p>

        <h1 className={styles.title}>
          {hero.title.map((t) => (
            <span key={t} className={styles.line}>
              <span>{t}</span>
            </span>
          ))}
        </h1>

        <div className={styles.bottom}>
          <ul className={styles.meta} data-hero-fade>
            {hero.meta.map((m) => <li key={m}>{m}</li>)}
          </ul>
          <a href="#intro" className={styles.scroll} data-hero-fade>
            <span>Scroll</span>
            <span className={styles.scrollLine} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
