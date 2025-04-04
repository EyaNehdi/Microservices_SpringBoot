"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import emailjs from "emailjs-com"
import "./styles.css"

function ReclamationForm({ refreshReclamations, editingReclamation, setEditingReclamation }) {
  const [reclamation, setReclamation] = useState({
    titre: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    type_reclamation: "MODEREE",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    if (editingReclamation) {
      setReclamation({
        id: editingReclamation.id,
        titre: editingReclamation.titre,
        description: editingReclamation.description,
        date: editingReclamation.date,
        type_reclamation: editingReclamation.type_reclamation,
      })
    } else {
      resetForm()
    }
  }, [editingReclamation])

  const resetForm = () => {
    setReclamation({
      titre: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      type_reclamation: "MODEREE",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!reclamation.titre.trim()) {
      newErrors.titre = "Le titre est obligatoire"
    } else if (reclamation.titre.trim().length < 2) {
      newErrors.titre = "Le titre doit contenir au moins 2 caractères"
    }
    if (!reclamation.description.trim()) {
      newErrors.description = "La description est obligatoire"
    } else if (reclamation.description.trim().length < 5) {
      newErrors.description = "La description doit contenir au moins 5 caractères"
    }
    if (!reclamation.date) {
      newErrors.date = "La date est obligatoire"
    }
    if (!reclamation.type_reclamation) {
      newErrors.type_reclamation = "Le type de réclamation est obligatoire"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setReclamation({ ...reclamation, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const sendEmailNotification = () => {
    const templateParams = {
      titre: reclamation.titre,
      description: reclamation.description,
      date: reclamation.date,
      type_reclamation: reclamation.type_reclamation,
      user_email: "jihedb01@gmail.com", // Remplacez par l'email du destinataire
    }
    emailjs.send("service_hgqse9n", "template_d0jpkze", templateParams, "R-frxwk22uHudOKxD")
      .then(() => console.log("Email envoyé avec succès"))
      .catch((error) => console.error("Erreur lors de l'envoi de l'email", error))
  }

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      if (editingReclamation) {
        await axios.put(`http://localhost:8087/reclamation/update/${reclamation.id}`, reclamation)
        setEditingReclamation(null)
        showNotification("La réclamation a été modifiée avec succès!")
      } else {
        await axios.post("http://localhost:8087/reclamation/ajout", reclamation)
        showNotification("La réclamation a été ajoutée avec succès!")
      }
      sendEmailNotification()
      resetForm()
      refreshReclamations()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réclamation:", error)
      showNotification("Échec de l'enregistrement. Veuillez réessayer.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="reclamation-form-container">
      {notification.show && (
        <div className={`notification ${notification.show ? 'show' : ''}`} style={{ backgroundColor: notification.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
          {notification.message}
        </div>
      )}
      
      <h2>{editingReclamation ? "Modifier la réclamation" : "Nouvelle réclamation"}</h2>
      
      <form onSubmit={handleSubmit} className="reclamation-form">
        <div className="form-group">
          <label htmlFor="titre">Titre</label>
          <input 
            type="text" 
            id="titre"
            name="titre" 
            value={reclamation.titre} 
            onChange={handleChange}
            className={errors.titre ? "input-error" : ""}
            placeholder="Entrez le titre de la réclamation"
          />
          {errors.titre && <div className="error-message">{errors.titre}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            name="description" 
            value={reclamation.description} 
            onChange={handleChange}
            className={errors.description ? "input-error" : ""}
            placeholder="Décrivez votre réclamation en détail"
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input 
            type="date" 
            id="date"
            name="date" 
            value={reclamation.date} 
            onChange={handleChange}
            className={errors.date ? "input-error" : ""}
          />
          {errors.date && <div className="error-message">{errors.date}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="type_reclamation">Type de réclamation</label>
          <select 
            id="type_reclamation"
            name="type_reclamation" 
            value={reclamation.type_reclamation} 
            onChange={handleChange}
            className={errors.type_reclamation ? "input-error" : ""}
          >
            <option value="MODEREE">MODEREE</option>
            <option value="GRAVE">GRAVE</option>
            <option value="TRES_GRAVE">TRES_GRAVE</option>
          </select>
          {errors.type_reclamation && <div className="error-message">{errors.type_reclamation}</div>}
        </div>
        
        <div className="form-buttons">
          {editingReclamation && (
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setEditingReclamation(null)}
            >
              Annuler
            </button>
          )}
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Envoyer"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReclamationForm
