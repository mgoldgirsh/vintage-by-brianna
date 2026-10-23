import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent } from 'react'
import type { Product } from '../types'
import { parseDescription } from '../lib/description'
import './ProductModal.css'

interface Props {
  product: Product
  onClose: () => void
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

function ProductModal({ product, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<Element | null>(document.activeElement)
  const touchStartX = useRef<number | null>(null)
  const titleId = useId()
  const [index, setIndex] = useState(0)

  const { photos } = product
  const count = photos.length
  const { text, tags } = useMemo(
    () => parseDescription(product.description),
    [product.description]
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus()
    }
  }, [])

  const go = useCallback(
    (step: number) => {
      if (count < 2) return
      setIndex((i) => (i + step + count) % count)
    },
    [count]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowLeft') go(-1)
    else if (e.key === 'ArrowRight') go(1)
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={dialogRef}
      className="detail"
      aria-labelledby={titleId}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        type="button"
        className="detail-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      <div className="detail-panel">
        <div className="gallery">
          <div
            className="gallery-stage"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              key={index}
              className="gallery-photo"
              src={photos[index]}
              alt={`${product.name}, photo ${index + 1} of ${count}`}
              decoding="async"
              referrerPolicy="no-referrer"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-arrow gallery-arrow-prev"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                >
                  <Chevron direction="left" />
                </button>
                <button
                  type="button"
                  className="gallery-arrow gallery-arrow-next"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                >
                  <Chevron direction="right" />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div className="thumbs">
              {photos.map((photo, i) => (
                <button
                  type="button"
                  key={photo}
                  className="thumb"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index}
                >
                  <img
                    src={photo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <h2 id={titleId} className="detail-name">
            {product.name}
          </h2>

          <p className="hangtag">
            <span className="sr-only">Price: </span>
            {product.price}
          </p>

          {text && <p className="detail-desc">{text}</p>}
          {tags.length > 0 && <p className="detail-tags">{tags.join(' ')}</p>}

          <div className="detail-actions">
            <p className="detail-note">One of one. Once it sells, it’s gone.</p>
            <a
              className="btn"
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy on Depop
            </a>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default ProductModal