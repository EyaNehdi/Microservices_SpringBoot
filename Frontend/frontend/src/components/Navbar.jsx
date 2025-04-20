import { Link, useLocation } from "react-router-dom"

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Product Management System</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/products" className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}>
            Products
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
