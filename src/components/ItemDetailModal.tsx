import { useEffect, useRef, useState, useCallback } from 'react'
import type { ClothingItem } from './ClothingSpotlight'
import './ItemDetailModal.css'

interface Props {
  item: ClothingItem
  originRect: DOMRect
  onClose: () => void
}

function ItemDetailModal({ item, originRect, onClose }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [closing, setClosing] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const photoRefs = useRef<(HTMLDivElement | null)[]>([])

  // Trigger the grow animation on the next frame after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setExpanded(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handleClose = useCallback(() => {
    setExpanded(false)
    setClosing(true)
    setTimeout(onClose, 280) // match CSS transition duration
  }, [onClose])

  const scrollToPhoto = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, item.photos.length - 1))
      photoRefs.current[clamped]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
      setPhotoIndex(clamped)
    },
    [item.photos.length]
  )

  // Keep photoIndex in sync with manual swipe/drag
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    let rafId: number | null = null

    const sync = () => {
      const rect = scroller.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      let closest = 0
      let closestDist = Infinity
      photoRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const dist = Math.abs(center - (r.left + r.width / 2))
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })
      setPhotoIndex((prev) => (prev !== closest ? closest : prev))
      rafId = null
    }

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(sync)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard: Escape closes, arrows flick photos
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      else if (e.key === 'ArrowRight') scrollToPhoto(photoIndex + 1)
      else if (e.key === 'ArrowLeft') scrollToPhoto(photoIndex - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [photoIndex, scrollToPhoto, handleClose])

  // CSS vars describing the clicked thumbnail's start position/size,
  // used to animate from there to a fullscreen-ish centered frame.
  const style = {
    '--start-top': `${originRect.top}px`,
    '--start-left': `${originRect.left}px`,
    '--start-width': `${originRect.width}px`,
    '--start-height': `${originRect.height}px`,
  } as React.CSSProperties

  return (
    <div
      className={`modal-backdrop ${expanded ? 'is-visible' : ''} ${
        closing ? 'is-closing' : ''
      }`}
      onClick={handleClose}
    >
      <div
        className={`modal-frame ${expanded ? 'is-expanded' : ''}`}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        <div className="modal-photo-scroller" ref={scrollerRef}>
          {item.photos.map((photo, i) => (
            <div
              className="modal-photo"
              key={i}
              ref={(el) => {
                photoRefs.current[i] = el
              }}
            >
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-photo-link"
                aria-label={`View ${item.name} on original listing`}
              >
                <img
                  src={photo}
                  alt={`${item.name} photo ${i + 1}`}
                  draggable={false}
                  loading="lazy"      // add this
                  decoding="async"    // and this
                />
              </a>
            </div>
          ))}
        </div>

        <div className="modal-info">
          <p className="modal-item-name">{item.name}</p>
          <div className="modal-dots">
            {item.photos.map((_, i) => (
              <button
                key={i}
                className={`modal-dot ${i === photoIndex ? 'is-active' : ''}`}
                onClick={() => scrollToPhoto(i)}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          className="modal-nav modal-nav-left"
          onClick={() => scrollToPhoto(photoIndex - 1)}
          disabled={photoIndex === 0}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <button
          className="modal-nav modal-nav-right"
          onClick={() => scrollToPhoto(photoIndex + 1)}
          disabled={photoIndex === item.photos.length - 1}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default ItemDetailModal