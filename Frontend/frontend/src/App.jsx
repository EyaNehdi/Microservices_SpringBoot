import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/navbar"
import Home from "./components/home"
import ProductManagement from "./components/ProductManagement"
import NotFound from "./components/NotFound"
import ReclamationManagement from "./components/reclamation-management"
import ReclamationStatistics from "./components/ReclamationStatistics"

import "./styles.css"

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/reclamation" element={<ReclamationManagement />} />
            <Route path="/statistics" element={<ReclamationStatistics/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>




  )
}

export default App
