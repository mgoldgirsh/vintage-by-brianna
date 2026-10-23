import './TopBar.css'

function TopBar() {
  return (
    <header className="top-bar">
      <a className="top-bar-title" href="#top">
        Bambi’s Vintage Supply
      </a>
      <nav className="top-bar-nav" aria-label="Primary">
        <a href="#shop">Shop</a>
        <a href="#about">About</a>
      </nav>
    </header>
  )
}

export default TopBar