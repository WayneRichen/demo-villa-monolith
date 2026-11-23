/**
 * All site content lives here.
 * Edit text, villas, or images in this file — components only handle layout.
 *
 * Images live in /public/images. `img()` builds a path that works from any
 * deploy sub-path (see `base` in vite.config.js).
 */
export const img = (file) => `${import.meta.env.BASE_URL}images/${file}`

export const brand = {
  name: 'MONOLITH',
  tagline: 'Private villas, built for stillness',
  founded: 2014,
  email: 'reservations@monolith.example',
  phone: '+39 081 000 0000',
  address: ['Via del Silenzio 7', '80067 Sorrento, Italy'],
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'Pinterest', href: '#' },
    { label: 'Vimeo', href: '#' },
  ],
}

export const nav = [
  { label: 'Collection', href: '#collection' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reservation', href: '#reservation' },
]

export const hero = {
  image: { src: img('hero.jpg'), width: 2400, height: 1600, alt: 'A low concrete house glowing at dusk beneath a large tree' },
  eyebrow: 'Private Villas — Est. 2014',
  title: ['Architecture', 'of Stillness'],
  meta: ['Italy · Greece · Norway', 'Three houses, by invitation'],
}

export const intro = {
  label: 'Philosophy',
  statement:
    'We build few houses, and we build them slowly. Each MONOLITH villa is shaped by its landscape — stone, light and silence arranged so that nothing competes with the view.',
  body: [
    'Our villas are not hotels. There is no lobby, no reception, no other guests. Each house is yours entirely, with a small team who appear when needed and disappear when not.',
    'We work with local architects and craftspeople, favour raw materials over finishes, and limit every house to a handful of stays per season.',
  ],
  image: { src: img('intro.jpg'), width: 1400, height: 2100, alt: 'Curved terracotta walls against a clear blue sky' },
  stats: [
    { value: '03', label: 'Houses' },
    { value: '2014', label: 'Founded' },
    { value: '24', label: 'Guests at most' },
  ],
}

export const villas = [
  {
    id: 'ora',
    name: 'Villa Ora',
    location: 'Sorrento',
    country: 'Italy',
    image: { src: img('villa-sorrento.jpg'), width: 1600, height: 1067, alt: 'Villa Ora — a white concrete villa with a long infinity pool' },
    detail: { src: img('villa-sorrento-detail.jpg'), width: 1400, height: 933, alt: 'Glass living room opening onto the pool at Villa Ora' },
    summary:
      'A cantilevered concrete house above the Gulf of Naples. An infinity pool draws a single line between terrace and sea.',
    size: 420,
    suites: 5,
    guests: 10,
    price: 3800,
    completed: 2021,
  },
  {
    id: 'lefko',
    name: 'Lefkó House',
    location: 'Oia, Santorini',
    country: 'Greece',
    image: { src: img('villa-santorini.jpg'), width: 1600, height: 1067, alt: 'Lefkó House — a lime-washed villa with a pool and palms' },
    summary:
      'Lime-washed walls and deep shade on the caldera edge. Built low against the meltemi wind, opened wide to the sunset.',
    size: 310,
    suites: 4,
    guests: 8,
    price: 2900,
    completed: 2019,
  },
  {
    id: 'stille',
    name: 'Stille Lodge',
    location: 'Hardanger',
    country: 'Norway',
    image: { src: img('villa-norway.jpg'), width: 1600, height: 1067, alt: 'Stille Lodge — an open-air bed on a timber deck above a fjord' },
    summary:
      'Timber and stone above the fjord. Beds open to the sky, a sauna at the water’s edge, and nothing else for miles.',
    size: 260,
    suites: 3,
    guests: 6,
    price: 2400,
    completed: 2024,
  },
]

export const experience = {
  label: 'Experience',
  title: 'Days measured in light',
  intro:
    'Every stay is arranged around the house and its surroundings — what to eat, where to swim, when to do nothing at all.',
  items: [
    {
      title: 'The Water',
      text: 'Infinity pools heated year-round, private moorings, and a boat on call for the coves only locals know.',
      image: { src: img('exp-pool.jpg'), width: 1800, height: 1200, alt: 'A timber deck and infinity pool facing the sea under palms' },
    },
    {
      title: 'The Table',
      text: 'A resident chef cooks from the morning market and the kitchen garden. Dinner is served wherever the light is best.',
      image: { src: img('exp-dining.jpg'), width: 1400, height: 933, alt: 'A candle-lit dinner table set with plates and wine glasses' },
    },
    {
      title: 'The Ritual',
      text: 'In-villa treatments, cold plunges and wood-fired saunas — designed around rest rather than schedules.',
      image: { src: img('exp-spa.jpg'), width: 1400, height: 933, alt: 'Hands holding a small bottle of massage oil in low light' },
    },
  ],
  landscape: {
    image: { src: img('exp-landscape.jpg'), width: 2000, height: 1333, alt: 'A turquoise alpine lake between steep forested mountains' },
    quote: 'Here, the landscape is the luxury.',
    services: [
      'Private transfer on arrival',
      'Dedicated house manager',
      'Daily housekeeping',
      'Curated excursions',
      'Resident chef on request',
      'Children & pets welcome',
    ],
  },
}

// Order is tuned so the three masonry columns end at similar heights.
export const gallery = [
  { src: img('gallery-07.jpg'), width: 1200, height: 2136, alt: 'Aerial view of surf meeting a pale shore', caption: 'Coastline — Sorrento' },
  { src: img('gallery-03.jpg'), width: 1400, height: 738, alt: 'A long living room with a clerestory window', caption: 'Living room — Villa Ora' },
  { src: img('gallery-02.jpg'), width: 1200, height: 801, alt: 'A freestanding bath beside a tall window', caption: 'Bath — Lefkó House' },
  { src: img('gallery-05.jpg'), width: 1200, height: 1800, alt: 'Dark timber facade lit from within', caption: 'Facade — Stille Lodge' },
  { src: img('gallery-01.jpg'), width: 1400, height: 952, alt: 'Open-plan living area with a timber wall', caption: 'Lounge — Villa Ora' },
  { src: img('gallery-08.jpg'), width: 1400, height: 933, alt: 'Timber and concrete house among trees', caption: 'Garden — Stille Lodge' },
  { src: img('gallery-04.jpg'), width: 1200, height: 1800, alt: 'A dark, minimal bathroom with a stone bath', caption: 'Bath — Stille Lodge' },
  { ...villas[0].detail, caption: 'Pool hall — Villa Ora' },
  { src: img('gallery-06.jpg'), width: 1400, height: 1400, alt: 'White cubic house against a blue sky', caption: 'Entrance — Lefkó House' },
]

export const reservation = {
  label: 'Reservation',
  title: 'Begin your stay',
  text: 'Tell us when and where. A member of our team will reply within one working day to confirm availability and shape the details of your stay.',
  image: { src: img('reservation.jpg'), width: 1600, height: 1067, alt: 'Two chairs on a white terrace overlooking the sea' },
  minNights: 3,
}

export const footerLinks = [
  { title: 'Houses', links: villas.map((v) => ({ label: v.name, href: '#collection' })) },
  { title: 'Explore', links: nav },
]
