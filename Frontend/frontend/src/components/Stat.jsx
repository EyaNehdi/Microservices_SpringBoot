import { useState, useEffect } from "react";
import EventForm from "./EventForm";
import { getAllEvents, deleteEvent, searchEvents } from "../api";
import "../styles.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Pie } from 'react-chartjs-2';  
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Stat() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [search, setSearch] = useState({ nomEvent: "", lieu: "" });
  
    useEffect(() => {
      fetchEvents();
      requestNotificationPermission();
    }, []);
  
    useEffect(() => {
      if (events.length > 0) {
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + 3);
  
        events.forEach((event) => {
          const eventDate = new Date(event.date);
          if (
              eventDate.getFullYear() === targetDate.getFullYear() &&
              eventDate.getMonth() === targetDate.getMonth() &&
              eventDate.getDate() === targetDate.getDate()
          ) {
            sendEventReminderNotification(event);
          }
        });
      }
    }, [events]);
  
    const requestNotificationPermission = () => {
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          console.log("Permission de notification :", permission);
        });
      }
    };
  
    const sendEventReminderNotification = (event) => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("📅 Rappel Événement", {
          body: `Vous avez un événement dans 3 jours : "${event.nomEvent}" à ${event.lieu}. N'hésitez pas à y assister !`,
          icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
        });
      }
    };
  
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getAllEvents();
        setEvents(data);
        console.log("Événements récupérés :", data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        alert("Échec de récupération des événements. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
  
    const refreshEvents = async (filteredData = null) => {
      if (filteredData) {
        setEvents(filteredData);
      } else {
        await fetchEvents();
      }
    };
  
    const handleEdit = (event) => {
      setEditingEvent(event);
      document.querySelector(".event-form-container")?.scrollIntoView({ behavior: "smooth" });
    };
  
    const handleDelete = async (id) => {
      try {
        await deleteEvent(id);
        refreshEvents();
        setShowConfirmDelete(false);
        setEventToDelete(null);
        showNotification("Événement supprimé avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        alert("Échec de la suppression de l'événement. Veuillez réessayer.");
      }
    };
  
    const confirmDelete = (event) => {
      setEventToDelete(event);
      setShowConfirmDelete(true);
    };
  
    const cancelDelete = () => {
      setShowConfirmDelete(false);
      setEventToDelete(null);
    };
  
    const showNotification = (message) => {
      const notification = document.createElement("div");
      notification.className = "notification";
      notification.textContent = message;
      document.body.appendChild(notification);
  
      setTimeout(() => notification.classList.add("show"), 10);
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    };
  
    const handleSearch = async () => {
      try {
        const results = await searchEvents(search.nomEvent, search.lieu);
        refreshEvents(results);
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        alert("Erreur lors de la recherche.");
      }
    };
  
    const resetSearch = () => {
      setSearch({ nomEvent: "", lieu: "" });
      refreshEvents();
    };
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };
  
    const generatePDF = () => {
      const doc = new jsPDF();
      doc.text("Liste des Événements", 14, 15);
  
      autoTable(doc, {
        startY: 20,
        head: [["Nom", "Description", "Date", "Lieu"]],
        body: events.map((event) => [
          event.nomEvent,
          event.description,
          formatDate(event.date),
          event.lieu,
        ]),
        styles: { fontSize: 10 },
      });
  
      doc.save("events.pdf");
    };
  
    // Statistiques par lieu sous forme de graphique circulaire
    const getStatsByLieu = () => {
      const lieuStats = events.reduce((acc, event) => {
        acc[event.lieu] = (acc[event.lieu] || 0) + 1;
        return acc;
      }, {});
  
      return {
        labels: Object.keys(lieuStats),
        datasets: [{
          data: Object.values(lieuStats),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
        }]
      };
    };
  
    return (
        <div className="app-container">
          <header className="app-header">
            <h1>Gestion des Événements</h1>
            <div className="search-container">
              <input
                  type="text"
                  placeholder="Rechercher par nom"
                  value={search.nomEvent}
                  onChange={(e) => setSearch({ ...search, nomEvent: e.target.value })}
                  className="search-input"
              />
              <input
                  type="text"
                  placeholder="Rechercher par lieu"
                  value={search.lieu}
                  onChange={(e) => setSearch({ ...search, lieu: e.target.value })}
                  className="search-input"
              />
              <button className="search-btn" onClick={handleSearch}>
                🔍 Rechercher
              </button>
              <button className="reset-btn" onClick={resetSearch}>
                🔄 Réinitialiser
              </button>
              <button className="pdf-btn" onClick={generatePDF}>
                📄 Exporter en PDF
              </button>
            </div>
          </header>
  
          <div className="content-container">
            <div className="event-form-container">
              <EventForm
                  refreshEvents={refreshEvents}
                  editingEvent={editingEvent}
                  setEditingEvent={setEditingEvent}
              />
            </div>
  
            <div className="event-list-container">
              <h2>Liste des Événements</h2>
              {loading ? (
                  <div className="loading">Chargement des événements...</div>
              ) : events.length === 0 ? (
                  <div className="no-events">
                    Aucun événement trouvé.{" "}
                    {search.nomEvent || search.lieu
                        ? "Essayez un autre filtre."
                        : "Ajoutez votre premier événement !"}</div>
              ) : (
                  <div className="table-container">
                    <table className="events-table">
                      <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Lieu</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {events.map((event) => (
                          <tr key={event.id}>
                            <td>{event.nomEvent}</td>
                            <td className="description-cell">{event.description}</td>
                            <td>{formatDate(event.date)}</td>
                            <td className="location-cell">{event.lieu}</td>
                            <td className="actions-cell">
                              <button className="edit-btn" onClick={() => handleEdit(event)}>
                                Modifier
                              </button>
                              <button className="delete-btn" onClick={() => confirmDelete(event)}>
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
  
            <div className="stat-container">
              <h2>Statistiques par Lieu</h2>
              <Pie data={getStatsByLieu()} />
            </div>
          </div>
  
          {showConfirmDelete && (
              <div className="modal-overlay">
                <div className="confirm-dialog">
                  <h3>Confirmer la Suppression</h3>
                  <p>
                    Êtes-vous sûr de vouloir supprimer <strong>{eventToDelete?.nomEvent}</strong> ?
                  </p>
                  <p>Cette action ne peut pas être annulée.</p>
                  <div className="dialog-buttons">
                    <button className="cancel-btn" onClick={cancelDelete}>
                      Annuler
                    </button>
                    <button className="confirm-btn" onClick={() => handleDelete(eventToDelete.id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
    );
  }

export default Stat