import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Intro from './components/Intro.jsx'
import Collection from './components/Collection.jsx'
import Experience from './components/Experience.jsx'
import Gallery from './components/Gallery.jsx'
import Reservation from './components/Reservation.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <Intro />
        <Collection />
        <Experience />
        <Gallery />
        <Reservation />
      </main>
      <Footer />
    </>
  )
}
