import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/navbar"
import Home from "./components/home"
import ProductManagement from "./components/ProductManagement"
import NotFound from "./components/NotFound"
import ReclamationManagement from "./components/reclamation-management"
import ReclamationStatistics from "./components/ReclamationStatistics"

import Commandes from "./components/Commandes"
import CommandeForm from "./components/CommandeForm"

import "./styles.css"
import Stat from "./components/Stat"
import Login from "./pages/Login"
import Register from "./pages/Register"
import DeliveryManager from "./components/DeliveryManager"



function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/reclamation" element={<ReclamationManagement />} />
            <Route path="/statistics" element={<ReclamationStatistics/>} />

            <Route path="/listcommande" element={<Commandes />} />
      <Route path="/commandeForm" element={<CommandeForm />} />
      <Route path="/update-commande/:commandeId" element={<CommandeForm />} />
      <Route path="/stat" element={<Stat />} />
      <Route path="/deliveries" element={<DeliveryManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>




  )
}

export default App
