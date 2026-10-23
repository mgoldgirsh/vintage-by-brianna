import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">© {new Date().getFullYear()} Bambi’s Vintage Supply</p>
      <a
        className="footer-link"
        href="https://www.depop.com/bambisvintagesupply/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Shop on Depop
      </a>
    </footer>
  )
}

export default Footer