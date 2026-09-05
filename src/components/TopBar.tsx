import './TopBar.css'

function TopBar() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="top-bar">
      <h1 className="top-bar-title">Brianna's Vintage</h1>
      <button className="top-bar-about-btn" onClick={scrollToAbout}>
        About
      </button>
    </header>
  )
}

export default TopBar