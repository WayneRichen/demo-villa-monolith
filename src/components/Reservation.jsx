import { useEffect, useMemo, useRef, useState } from 'react'
import { reservation, villas } from '../data/site.js'
import { useReveal } from '../hooks/useReveal.js'
import styles from './Reservation.module.css'

const EMPTY = { villa: '', checkIn: '', checkOut: '', guests: '2', name: '', email: '', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DAY = 86_400_000

const localISO = (d) => {
  const off = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - off).toISOString().slice(0, 10)
}
const nightsBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / DAY)
const fmtDate = (s) =>
  new Date(`${s}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function validate(v, today) {
  const e = {}
  const villa = villas.find((x) => x.id === v.villa)
  if (!villa) e.villa = 'Please choose a house.'
  if (!v.checkIn) e.checkIn = 'Choose an arrival date.'
  else if (v.checkIn < today) e.checkIn = 'Arrival can’t be in the past.'
  if (!v.checkOut) e.checkOut = 'Choose a departure date.'
  else if (v.checkIn && v.checkOut <= v.checkIn) e.checkOut = 'Departure must be after arrival.'
  else if (v.checkIn && nightsBetween(v.checkIn, v.checkOut) < reservation.minNights)
    e.checkOut = `Minimum stay is ${reservation.minNights} nights.`
  if (villa && Number(v.guests) > villa.guests) e.guests = `${villa.name} sleeps up to ${villa.guests}.`
  if (!v.name.trim()) e.name = 'Please tell us your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  return e
}

export default function Reservation() {
  const root = useRef(null)
  const formRef = useRef(null)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const today = useMemo(() => localISO(new Date()), [])

  useReveal(root)

  // Pre-select a villa when chosen from the Collection carousel.
  useEffect(() => {
    const onSelect = (e) => {
      setValues((v) => ({ ...v, villa: e.detail }))
      setErrors((er) => ({ ...er, villa: undefined }))
      setStatus('idle')
    }
    window.addEventListener('monolith:select-villa', onSelect)
    return () => window.removeEventListener('monolith:select-villa', onSelect)
  }, [])

  const villa = villas.find((x) => x.id === values.villa)
  const nights = values.checkIn && values.checkOut ? nightsBetween(values.checkIn, values.checkOut) : 0
  const maxGuests = villa?.guests ?? Math.max(...villas.map((x) => x.guests))
  const estimate = villa && nights > 0 ? villa.price * nights : null

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => {
      const next = { ...v, [name]: value }
      // Keep the guest count within the chosen villa's capacity.
      const cap = villas.find((x) => x.id === next.villa)?.guests
      if (cap && Number(next.guests) > cap) next.guests = String(cap)
      return next
    })
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values, today)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      formRef.current.elements[firstInvalid]?.focus()
      return
    }
    // No backend: simulate a short request, then confirm.
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1200)
  }

  const reset = () => {
    setValues(EMPTY)
    setErrors({})
    setStatus('idle')
  }

  const field = (name) => ({
    id: `res-${name}`,
    name,
    value: values[name],
    onChange: update,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `res-${name}-err` : undefined,
  })

  const err = (name) =>
    errors[name] ? <span id={`res-${name}-err`} className={styles.error} role="alert">{errors[name]}</span> : null

  return (
    <section id="reservation" ref={root} className={styles.reservation}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.aside}>
          <p className="eyebrow" data-reveal="up">
            <span className="eyebrow-num">(05)</span> {reservation.label}
          </p>
          <h2 data-reveal="lines">{reservation.title}</h2>
          <p className={styles.intro} data-reveal="up">{reservation.text}</p>
          <figure className={`zoom ${styles.media}`} data-reveal="image">
            <img src={reservation.image.src} width={reservation.image.width} height={reservation.image.height} alt={reservation.image.alt} loading="lazy" />
          </figure>
        </div>

        <div className={styles.panel} data-reveal="up">
          {status === 'sent' ? (
            <div className={styles.success} role="status">
              <p className="eyebrow">Request received</p>
              <h3>Thank you, {values.name.trim().split(' ')[0]}.</h3>
              <p>
                We’ll write to <strong>{values.email}</strong> within one working day to confirm your stay.
              </p>
              <dl className={styles.summary}>
                <div><dt>House</dt><dd>{villa.name}, {villa.location}</dd></div>
                <div><dt>Dates</dt><dd>{fmtDate(values.checkIn)} — {fmtDate(values.checkOut)}</dd></div>
                <div><dt>Nights</dt><dd>{nights}</dd></div>
                <div><dt>Guests</dt><dd>{values.guests}</dd></div>
                <div><dt>Estimate</dt><dd>€{estimate.toLocaleString('en-US')}</dd></div>
              </dl>
              <button type="button" className="btn btn--ghost" onClick={reset}>Make another request</button>
            </div>
          ) : (
            <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="res-villa">House</label>
                <select {...field('villa')}>
                  <option value="" disabled>Select a villa</option>
                  {villas.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} — {v.location}, {v.country}</option>
                  ))}
                </select>
                {err('villa')}
              </div>

              <div className={styles.field}>
                <label htmlFor="res-checkIn">Arrival</label>
                <input type="date" min={today} {...field('checkIn')} />
                {err('checkIn')}
              </div>

              <div className={styles.field}>
                <label htmlFor="res-checkOut">Departure</label>
                <input type="date" min={values.checkIn || today} {...field('checkOut')} />
                {err('checkOut')}
              </div>

              <div className={styles.field}>
                <label htmlFor="res-guests">Guests</label>
                <select {...field('guests')}>
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
                {err('guests')}
              </div>

              <div className={styles.field}>
                <label htmlFor="res-name">Full name</label>
                <input type="text" autoComplete="name" {...field('name')} />
                {err('name')}
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="res-email">Email</label>
                <input type="email" autoComplete="email" inputMode="email" {...field('email')} />
                {err('email')}
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="res-message">Anything we should know? <span>(optional)</span></label>
                <textarea rows={3} {...field('message')} />
              </div>

              <div className={styles.submitRow}>
                <p className={styles.estimate} aria-live="polite">
                  {estimate
                    ? <>{nights} nights · <strong>€{estimate.toLocaleString('en-US')}</strong> estimated</>
                    : `Minimum stay ${reservation.minNights} nights`}
                </p>
                <button type="submit" className="btn" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Request to reserve'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
