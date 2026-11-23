import { useRef } from 'react'
import { intro } from '../data/site.js'
import { useReveal, gsap, SplitText } from '../hooks/useReveal.js'
import styles from './Intro.module.css'

export default function Intro() {
  const root = useRef(null)

  useReveal(root, (q) => {
    // Statement: words brighten one by one as the reader scrolls through it.
    const statement = q(`.${styles.statement}`)[0]
    SplitText.create(statement, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
          },
        ),
    })
  })

  return (
    <section id="intro" ref={root} className={styles.intro}>
      <div className={`container ${styles.grid}`}>
        <p className={`eyebrow ${styles.label}`} data-reveal="up">
          <span className="eyebrow-num">(01)</span> {intro.label}
        </p>

        <p className={styles.statement}>{intro.statement}</p>

        <figure className={`zoom ${styles.figure}`} data-reveal="image">
          <img src={intro.image.src} width={intro.image.width} height={intro.image.height} alt={intro.image.alt} loading="lazy" />
        </figure>

        <div className={styles.body}>
          <div className={styles.paras} data-reveal="stagger">
            {intro.body.map((p) => <p key={p}>{p}</p>)}
          </div>

          <dl className={styles.stats} data-reveal="stagger">
            {intro.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
