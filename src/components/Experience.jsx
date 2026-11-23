import { useRef } from 'react'
import { experience } from '../data/site.js'
import { useReveal, gsap } from '../hooks/useReveal.js'
import styles from './Experience.module.css'

export default function Experience() {
  const root = useRef(null)
  const { landscape } = experience

  useReveal(root, (q) => {
    // Parallax: the landscape photo drifts slower than the page.
    gsap.fromTo(
      q(`.${styles.bandImg}`),
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: q(`.${styles.band}`)[0], start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })

  return (
    <section id="experience" ref={root} className={styles.experience}>
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" data-reveal="up">
              <span className="eyebrow-num">(03)</span> {experience.label}
            </p>
            <h2 data-reveal="lines">{experience.title}</h2>
          </div>
          <p className={styles.lead} data-reveal="up">{experience.intro}</p>
        </header>

        <div className={styles.items}>
          {experience.items.map((item, i) => (
            <article key={item.title} className={styles.item}>
              <figure className={`zoom ${styles.media}`} data-reveal="image">
                <img src={item.image.src} width={item.image.width} height={item.image.height} alt={item.image.alt} loading="lazy" />
              </figure>
              <div className={styles.text} data-reveal="stagger">
                <span className={styles.num}>0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.band}>
        <img
          className={styles.bandImg}
          src={landscape.image.src}
          width={landscape.image.width}
          height={landscape.image.height}
          alt={landscape.image.alt}
          loading="lazy"
        />
        <div className={styles.bandShade} aria-hidden="true" />
        <blockquote className={styles.quote} data-reveal="lines">{landscape.quote}</blockquote>
      </div>

      <div className="container">
        <div className={styles.services}>
          <p className="eyebrow" data-reveal="up">Included with every stay</p>
          <ul data-reveal="stagger">
            {landscape.services.map((s, i) => (
              <li key={s}><span>{String(i + 1).padStart(2, '0')}</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
