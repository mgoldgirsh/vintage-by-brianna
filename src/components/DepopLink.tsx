import './DepopLink.css'

function DepopLink() {
  return (
    <a
      className="depop-link"
      href="https://www.depop.com/bambisvintagesupply/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Shop Bambi's Vintage Supply on Depop"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7V6a3 3 0 0 1 6 0v1" />
      </svg>
      <span className="depop-link-label">Shop on Depop</span>
    </a>
  )
}

export default DepopLink