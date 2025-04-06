import './App.css'
import NavigationBar from './components/navigationBar'
import { Routes, Route } from 'react-router-dom';
import CommandeForm from './components/CommandeForm';
import Commandes from './components/Commandes';
function App() {

  return (
    <>
    <NavigationBar />
    <Routes>
      <Route path="/" element={<Commandes />} />
      <Route path="/commandeForm" element={<CommandeForm />} />
      <Route path="/update-commande/:commandeId" element={<CommandeForm />} />
    </Routes>
    </>
  )
}

export default App
