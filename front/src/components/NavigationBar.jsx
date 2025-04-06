import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
function NavigationBar() {
  return (
    <>
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link as={NavLink} to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Mes commandes</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/commandeForm" className={({ isActive }) => isActive ? "active-link" : ""}>Ajouter une commande</Nav.Link>
      </Nav.Item>
    </Nav>
    </>
  )
}

export default NavigationBar