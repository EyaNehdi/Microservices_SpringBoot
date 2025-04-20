import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="home-link">
        Return to Home
      </Link>
    </div>
  )
}

export default NotFound
