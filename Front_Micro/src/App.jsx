"use client"

import { useState, useEffect } from "react"
import ReclamationForm from "./ReclamationForm"
import axios from "axios"
import "./styles.css" // You'll need to create this CSS file

function App() {
  const [reclamations, setReclamations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingReclamation, setEditingReclamation] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [reclamationToDelete, setReclamationToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReclamations()
  }, [])

  const fetchReclamations = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:8087/reclamation/get")
      setReclamations(response.data)
    } catch (error) {
      console.error("Error fetching reclamations:", error)
      alert("Échec de récupération des réclamations. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const refreshReclamations = () => {
    fetchReclamations()
  }

  const handleEdit = (reclamation) => {
    setEditingReclamation(reclamation)
    // Scroll to form
    document.querySelector(".reclamation-form-container").scrollIntoView({ behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8087/reclamation/supp/${id}`)
      refreshReclamations()
      setShowConfirmDelete(false)
      setReclamationToDelete(null)
      showNotification("Réclamation supprimée avec succès!")
    } catch (error) {
      console.error("Error deleting reclamation:", error)
      alert("Échec de la suppression de la réclamation. Veuillez réessayer.")
    }
  }

  const confirmDelete = (reclamation) => {
    setReclamationToDelete(reclamation)
    setShowConfirmDelete(true)
  }

  const cancelDelete = () => {
    setShowConfirmDelete(false)
    setReclamationToDelete(null)
  }

  const showNotification = (message) => {
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  const filteredReclamations = reclamations.filter(
    (reclamation) =>
      reclamation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reclamation.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gestion des Réclamations</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher des réclamations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="content-container">
        <div className="reclamation-form-container">
          <ReclamationForm
            refreshReclamations={refreshReclamations}
            editingReclamation={editingReclamation}
            setEditingReclamation={setEditingReclamation}
          />
        </div>

        <div className="reclamation-list-container">
          <h2>Liste des Réclamations</h2>
          {loading ? (
            <div className="loading">Chargement des réclamations...</div>
          ) : filteredReclamations.length === 0 ? (
            <div className="no-reclamations">
              {searchTerm
                ? "Aucune réclamation ne correspond à votre recherche"
                : "Aucune réclamation trouvée. Ajoutez votre première réclamation!"}
            </div>
          ) : (
            <div className="table-container">
              <table className="reclamations-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReclamations.map((reclamation) => (
                    <tr key={reclamation.id}>
                      <td>{reclamation.titre}</td>
                      <td className="description-cell">{reclamation.description}</td>
                      <td>{formatDate(reclamation.date)}</td>
                      <td className="type-cell">{reclamation.type_reclamation}</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEdit(reclamation)}>
                          Modifier
                        </button>
                        <button className="delete-btn" onClick={() => confirmDelete(reclamation)}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3>Confirmer la Suppression</h3>
            <p>
              Êtes-vous sûr de vouloir supprimer <strong>{reclamationToDelete?.titre}</strong>?
            </p>
            <p>Cette action ne peut pas être annulée.</p>
            <div className="dialog-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>
                Annuler
              </button>
              <button className="confirm-btn" onClick={() => handleDelete(reclamationToDelete.id)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

