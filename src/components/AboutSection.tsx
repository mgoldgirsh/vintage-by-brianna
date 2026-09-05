import leopardSwatch from '../assets/leopard.png'
import './AboutSection.css'

function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <div className="about-text-block">
          <h2 className="about-heading">A little bit about us</h2>
          <p className="about-text">
            Brianna's Vintage is a hand-picked selection of pre-loved
            clothing, sourced piece by piece for character, quality, and a
            bit of history. Everything here has already lived a life — we're
            just finding it a new one.
          </p>
          <p className="about-text">
            Every item is one of one. Once it's gone, it's gone, so if
            something catches your eye, don't wait too long on it.
          </p>
        </div>
        <div className="about-swatch">
          <img src={leopardSwatch} alt="A close-up of leopard-print fabric from the collection" />
        </div>
      </div>
    </section>
  )
}

export default AboutSection