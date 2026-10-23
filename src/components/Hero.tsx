import type { Product } from '../types'
import './Hero.css'

interface Props {
  featured?: Product
  onOpen: (product: Product) => void
}

function Hero({ featured, onOpen }: Props) {
  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <h1 className="hero-title">Pre-loved pieces, each one of a kind.</h1>
        <p className="hero-sub">
          Brand-name and Y2K finds, hand-picked and sold one piece at a time.
        </p>
        <a className="btn" href="#shop">
          Browse the collection
        </a>
      </div>

      {featured && (
        <button
          type="button"
          className="hero-feature"
          onClick={() => onOpen(featured)}
          aria-haspopup="dialog"
        >
          <span className="hero-feature-media">
            <img
              src={featured.photos[0]}
              alt=""
              referrerPolicy="no-referrer"
              decoding="async"
            />
          </span>
          <span className="hero-feature-caption">
            <span>{featured.name}</span>
            <span className="hero-feature-price">{featured.price}</span>
          </span>
        </button>
      )}
    </section>
  )
}

export default Hero