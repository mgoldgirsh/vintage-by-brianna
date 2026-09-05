import { useEffect } from 'react'
import './AboutPanel.css'

interface Props {
  onClose: () => void
}

function AboutPanel({ onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="about-backdrop" onClick={onClose}>
      <div className="about-panel" onClick={(e) => e.stopPropagation()}>
        <button className="about-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="about-title">About</h2>
        <p className="about-text">
          Brianna's Vintage is a hand-picked selection of pre-loved clothing,
          sourced piece by piece for character, quality, and a bit of
          history. Everything here has already lived a life — we're just
          finding it a new one.
        </p>
        <p className="about-text">
          Every item is one of one. Once it's gone, it's gone.
        </p>
      </div>
    </div>
  )
}

export default AboutPanel