import { useEffect } from 'react'
import type { RefObject, MutableRefObject } from 'react'

export function useSpotlightScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  itemRefs: MutableRefObject<(HTMLDivElement | null)[]>
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId: number | null = null

    const update = () => {
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      itemRefs.current.forEach((el) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const itemCenter = rect.left + rect.width / 2
        const distance = Math.abs(containerCenter - itemCenter)
        const maxDistance = containerRect.width / 2

        const t = Math.min(distance / maxDistance, 1)

        const brightness = 1 - t * 0.85
        const scale = 1 - t * 0.22
        const opacity = 1 - t * 0.55

        el.style.setProperty('--brightness', brightness.toString())
        el.style.setProperty('--scale', scale.toString())
        el.style.setProperty('--opacity', opacity.toString())
      })

      rafId = null
    }

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    update()
    container.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      container.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [containerRef, itemRefs])
}