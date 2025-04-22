import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './styles.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">E-Commerce Admin</NavLink>
      </div>
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <ul className={`navbar-nav ${isOpen ? 'open' : ''}`}>
        <li className="nav-item">
          <NavLink to="/login" className="nav-link" end>Login</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/products" className="nav-link">Products</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/reclamation" className="nav-link">Reclamations</NavLink>
        </li>
      
        <li className="nav-item">
          <NavLink to="/listcommande" className="nav-link">Orders</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/commandeForm" className="nav-link">AddOrders</NavLink>
        </li>
      
        <li className="nav-item">
          <NavLink to="/stat" className="nav-link">Events</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;