import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useSpotlightScroll } from '../hooks/useSpotlightScroll'
import ItemDetailModal from './ItemDetailModal'
import './ClothingSpotlight.css'

export interface ClothingItem {
  id: string
  name: string
  photos: string[]
  sourceUrl: string
}

interface Props {
  items: ClothingItem[]
}

interface LoopEntry {
  item: ClothingItem
  renderIndex: number
  key: string
}

function ClothingSpotlight({ items }: Props) {
  const N = items.length
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<{
    item: ClothingItem
    rect: DOMRect
  } | null>(null)

  // Render 3 copies back-to-back so there's always a neighbor to scroll
  // to in either direction — this is what makes the loop feel infinite.
  const loopItems: LoopEntry[] = useMemo(() => {
    const arr: LoopEntry[] = []
    for (let copy = 0; copy < 3; copy++) {
      items.forEach((item, i) => {
        const renderIndex = copy * N + i
        arr.push({ item, renderIndex, key: `${item.id}-copy${copy}` })
      })
    }
    return arr
  }, [items, N])

  useSpotlightScroll(containerRef, itemRefs)

  const findCenteredRenderIndex = useCallback(() => {
    const container = containerRef.current
    if (!container) return N
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    let closest = N
    let closestDistance = Infinity
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const itemCenter = rect.left + rect.width / 2
      const distance = Math.abs(containerCenter - itemCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closest = i
      }
    })
    return closest
  }, [N])

  const scrollToRenderIndex = useCallback(
    (renderIndex: number, behavior: ScrollBehavior = 'smooth') => {
      itemRefs.current[renderIndex]?.scrollIntoView({
        behavior,
        inline: 'center',
        block: 'nearest',
      })
    },
    []
  )

  const step = useCallback(
    (delta: 1 | -1) => {
      const current = findCenteredRenderIndex()
      scrollToRenderIndex(current + delta)
    },
    [findCenteredRenderIndex, scrollToRenderIndex]
  )

  // Jump straight to the middle copy on first mount, no animation.
  useEffect(() => {
    if (N === 0) return
    scrollToRenderIndex(N, 'auto')
    setActiveIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N])

  // Keep activeIndex in sync, and silently recenter back into the middle
  // copy whenever the user scrolls/drags into one of the outer buffer copies.
  useEffect(() => {
    const container = containerRef.current
    if (!container || N === 0) return
    let rafId: number | null = null

    const sync = () => {
      const closest = findCenteredRenderIndex()
      const originalIndex = ((closest % N) + N) % N
      setActiveIndex((prev) => (prev !== originalIndex ? originalIndex : prev))

      if (closest < N || closest >= 2 * N) {
        scrollToRenderIndex(N + originalIndex, 'auto') // instant, invisible jump
      }
      rafId = null
    }

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(sync)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [N, findCenteredRenderIndex, scrollToRenderIndex])

  // Keyboard navigation (disabled while the modal is open)
  useEffect(() => {
    if (selected) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [step, selected])

  const openItem = (item: ClothingItem, renderIndex: number) => {
    const el = imgRefs.current[renderIndex]
    if (!el) return
    setSelected({ item, rect: el.getBoundingClientRect() })
  }

  return (
    <div className="spotlight-wrapper">
      <div
        className="spotlight-scroller"
        ref={containerRef}
        role="listbox"
        aria-label="Clothing items"
        tabIndex={0}
      >
        {loopItems.map(({ item, renderIndex, key }) => (
          <div
            className="spotlight-item"
            key={key}
            ref={(el) => {
              itemRefs.current[renderIndex] = el
            }}
            role="option"
            aria-selected={renderIndex % N === activeIndex}
            tabIndex={-1}
            onClick={() => openItem(item, renderIndex)}
          >
            <img
              ref={(el) => {
                imgRefs.current[renderIndex] = el
              }}
              src={item.photos[0]}
              alt={item.name}
              draggable={false}
              loading="lazy"      // add this
              decoding="async"    // and this
            />
            <p className="spotlight-label">{item.name}</p>
          </div>
        ))}
      </div>

      <div className="spotlight-vignette" />
      <div className="spotlight-edge-fade spotlight-edge-fade-left" />
      <div className="spotlight-edge-fade spotlight-edge-fade-right" />

      <button
        className="spotlight-nav spotlight-nav-left"
        onClick={() => step(-1)}
        aria-label="Previous item"
      >
        ‹
      </button>
      <button
        className="spotlight-nav spotlight-nav-right"
        onClick={() => step(1)}
        aria-label="Next item"
      >
        ›
      </button>

      {selected && (
        <ItemDetailModal
          item={selected.item}
          originRect={selected.rect}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default ClothingSpotlight