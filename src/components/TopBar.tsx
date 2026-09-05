import { useState } from 'react'
import AboutPanel from './AboutPanel'
import './TopBar.css'

function TopBar() {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <>
      <header className="top-bar">
        <h1 className="top-bar-title">Brianna's Vintage</h1>
        <button
          className="top-bar-about-btn"
          onClick={() => setAboutOpen(true)}
        >
          About
        </button>
      </header>

      {aboutOpen && <AboutPanel onClose={() => setAboutOpen(false)} />}
    </>
  )
}

export default TopBar