"use client";

import { useState, useEffect } from "react";
import "../styles.css";
import {
  addEvent,
  updateEvent,
  searchEvents,
  exportPDF,
  deleteEvent,
  triggerReminderNotifications, // ✅ ajout de l'import
} from "../api";

function EventForm({ refreshEvents, editingEvent, setEditingEvent }) {
  const [event, setEvent] = useState({
    nomEvent: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    lieu: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [search, setSearch] = useState({ nomEvent: "", lieu: "" });

  useEffect(() => {
    if (editingEvent) {
      setEvent({
        id: editingEvent.id,
        nomEvent: editingEvent.nomEvent,
        description: editingEvent.description,
        date: editingEvent.date,
        lieu: editingEvent.lieu,
      });
    } else {
      resetForm();
    }
  }, [editingEvent]);

  const resetForm = () => {
    setEvent({
      nomEvent: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      lieu: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!event.nomEvent.trim()) {
      newErrors.nomEvent = "Le nom est obligatoire";
    } else if (event.nomEvent.trim().length < 2) {
      newErrors.nomEvent = "Le nom doit contenir au moins 2 caractères";
    }

    if (!event.description.trim()) {
      newErrors.description = "La description est obligatoire";
    } else if (event.description.trim().length < 5) {
      newErrors.description = "La description doit contenir au moins 5 caractères";
    }

    if (!event.date) {
      newErrors.date = "La date est obligatoire";
    }

    if (!event.lieu.trim()) {
      newErrors.lieu = "Le lieu est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateEvent(event.id, event);
        setEditingEvent(null);
        showNotification("L'événement a été modifié avec succès !");
      } else {
        await addEvent(event);
        showNotification("L'événement a été ajouté avec succès !");
      }
      resetForm();
      refreshEvents();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      showNotification("Échec de l'enregistrement. Veuillez réessayer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await searchEvents(search.nomEvent, search.lieu);
      refreshEvents(result); // ← on envoie les résultats filtrés au parent
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      showNotification("Erreur lors de la recherche.", "error");
    }
  };


  const handleExportPDF = async () => {
    try {
      const events = await refreshEvents();
      const pdfData = await exportPDF(events);

      const blob = new Blob([pdfData], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "evenements.pdf";
      link.click();

      showNotification("Exportation en PDF réussie !");
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF :", error);
      showNotification("Erreur lors de l'exportation PDF.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      showNotification("L'événement a été supprimé avec succès !");
      refreshEvents();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement", error);
      showNotification("Échec de la suppression de l'événement.", "error");
    }
  };

  // ✅ Nouvelle fonction pour lancer les rappels manuellement
  const handleSendReminders = async () => {
    try {
      await triggerReminderNotifications();
      showNotification("Notifications de rappel envoyées !");
    } catch (error) {
      console.error("Erreur lors de l'envoi des rappels :", error);
      showNotification("Échec de l'envoi des rappels.", "error");
    }
  };

  return (
      <div className="event-form-container">
        {notification.show && (
            <div
                className={`notification ${notification.show ? "show" : ""}`}
                style={{ backgroundColor: notification.type === "error" ? "var(--danger)" : "var(--success)" }}
            >
              {notification.message}
            </div>
        )}

        <h2>{editingEvent ? "Modifier l'événement" : "Nouvel événement"}</h2>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="nomEvent">Nom</label>
            <input
                type="text"
                id="nomEvent"
                name="nomEvent"
                value={event.nomEvent}
                onChange={handleChange}
                className={errors.nomEvent ? "input-error" : ""}
                placeholder="Entrez le nom de l'événement"
            />
            {errors.nomEvent && <div className="error-message">{errors.nomEvent}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                name="description"
                value={event.description}
                onChange={handleChange}
                className={errors.description ? "input-error" : ""}
                placeholder="Décrivez l'événement"
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
                type="date"
                id="date"
                name="date"
                value={event.date}
                onChange={handleChange}
                className={errors.date ? "input-error" : ""}
            />
            {errors.date && <div className="error-message">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="lieu">Lieu</label>
            <input
                type="text"
                id="lieu"
                name="lieu"
                value={event.lieu}
                onChange={handleChange}
                className={errors.lieu ? "input-error" : ""}
                placeholder="Entrez le lieu"
            />
            {errors.lieu && <div className="error-message">{errors.lieu}</div>}
          </div>

          <div className="form-buttons">
            {editingEvent && (
                <>
                  <button type="button" className="cancel-button" onClick={() => setEditingEvent(null)}>
                    Annuler
                  </button>
                  <button type="button" className="delete-button" onClick={() => handleDelete(editingEvent.id)}>
                    Supprimer l'événement
                  </button>
                </>
            )}
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Envoyer"}
            </button>
          </div>
        </form>



        

      </div>
      
  );
}

export default EventForm;
