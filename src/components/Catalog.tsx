import type { Product } from '../types'
import './Catalog.css'

interface Props {
  products: Product[]
  onOpen: (product: Product) => void
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: Props['onOpen'] }) {
  const [primary, secondary] = product.photos

  return (
    <button
      type="button"
      className="product-btn"
      onClick={() => onOpen(product)}
      aria-haspopup="dialog"
    >
      <span className="product-media">
        <img
          src={primary}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        {secondary && (
          <img
            className="product-alt"
            src={secondary}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        )}
      </span>
      <span className="product-info">
        <span className="product-name">{product.name}</span>
        <span className="product-price">{product.price}</span>
      </span>
    </button>
  )
}

function Catalog({ products, onOpen }: Props) {
  const count = products.length

  return (
    <section id="shop" className="catalog">
      <div className="catalog-head">
        <h2 className="catalog-title">The collection</h2>
        <p className="catalog-count">
          {count} {count === 1 ? 'piece' : 'pieces'}
        </p>
      </div>

      {count === 0 ? (
        <p className="catalog-empty">
          Nothing is listed right now. New pieces are posted on{' '}
          <a
            href="https://www.depop.com/bambisvintagesupply/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Depop
          </a>
          .
        </p>
      ) : (
        <ul className="catalog-grid">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Catalog