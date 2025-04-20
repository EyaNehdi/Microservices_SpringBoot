import { Link, useLocation } from "react-router-dom"

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Système de Gestion</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Accueil
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/products" className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}>
            Produits
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/reclamations" className={`nav-link ${location.pathname === "/reclamations" ? "active" : ""}`}>
            Réclamations
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
