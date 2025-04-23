import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './styles.css';

import { useAuthStore } from '../store/authStore'; // Adjust the import path as necessary

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, ClearUser,isAuthenticated } = useAuthStore(); // Assuming you have a useAuthStore hook
  const navigate = useNavigate(); // Initialize navigate
  const handleLogout = () => {
    logout();
    ClearUser();
    navigate('/login'); // Redirect to login page after logout
  };
  
  
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
        {isAuthenticated=== false && (
          <li className="nav-item">
          <NavLink to="/login" className="nav-link" end>Login</NavLink>
        </li>
        )}
       
        {isAuthenticated && (
                 <li className="nav-item">
                 <a href="#" className="nav-link" onClick={handleLogout}>Logout</a>
                   
                </li>
        )}

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
          <NavLink to="/deliveries" className="nav-link">Deliveries</NavLink>
        </li>
      
        <li className="nav-item">
          <NavLink to="/stat" className="nav-link">Events</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;