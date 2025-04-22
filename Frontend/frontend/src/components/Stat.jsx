"use client"

import { useState, useEffect } from "react"
import EventForm from "./EventForm"
import { getAllEvents, deleteEvent, searchEvents } from "../api"
import "../styles.css"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

function Stat() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [search, setSearch] = useState({ nomEvent: "", lieu: "" })

  useEffect(() => {
    fetchEvents()
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      const today = new Date()
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() + 3)

      events.forEach((event) => {
        const eventDate = new Date(event.date)
        if (
          eventDate.getFullYear() === targetDate.getFullYear() &&
          eventDate.getMonth() === targetDate.getMonth() &&
          eventDate.getDate() === targetDate.getDate()
        ) {
          sendEventReminderNotification(event)
        }
      })
    }
  }, [events])
  useEffect(() => {
    const interval = setInterval(() => {
      checkUpcomingEvents();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("Permission de notification :", permission)
      })
    }
  }

  const sendEventReminderNotification = (event) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("📅 Rappel Événement", {
        body: `Vous avez un événement dans 3 jours : "${event.nomEvent}" à ${event.lieu}. N'hésitez pas à y assister !`,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
      })
    }
  }
 
const checkUpcomingEvents = async () => {
    try {
      const res = await fetch("http://localhost:7000/event/notify/3days");
      const events = await res.json();

      events.forEach((event) => {
        sendEventReminderNotification(event);
      });
    } catch (error) {
      console.error("Erreur lors de la vérification des rappels d'événements :", error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await getAllEvents()
      setEvents(data)
      console.log("Événements récupérés :", data)
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error)
      alert("Échec de récupération des événements. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const refreshEvents = async (filteredData = null) => {
    if (filteredData) {
      setEvents(filteredData)
    } else {
      await fetchEvents()
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    document.querySelector(".event-form-container")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id)
      refreshEvents()
      setShowConfirmDelete(false)
      setEventToDelete(null)
      showNotification("Événement supprimé avec succès!")
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement :", error)
      alert("Échec de la suppression de l'événement. Veuillez réessayer.")
    }
  }

  const confirmDelete = (event) => {
    setEventToDelete(event)
    setShowConfirmDelete(true)
  }

  const cancelDelete = () => {
    setShowConfirmDelete(false)
    setEventToDelete(null)
  }

  const showNotification = (message) => {
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => notification.classList.add("show"), 10)
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  const handleSearch = async () => {
    try {
      const results = await searchEvents(search.nomEvent, search.lieu)
      refreshEvents(results)
    } catch (error) {
      console.error("Erreur lors de la recherche :", error)
      alert("Erreur lors de la recherche.")
    }
  }

  const resetSearch = () => {
    setSearch({ nomEvent: "", lieu: "" })
    refreshEvents()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    doc.text("Liste des Événements", 14, 15)

    autoTable(doc, {
      startY: 20,
      head: [["Nom", "Description", "Date", "Lieu"]],
      body: events.map((event) => [event.nomEvent, event.description, formatDate(event.date), event.lieu]),
      styles: { fontSize: 10 },
    })

    doc.save("events.pdf")
  }

  // Statistiques par lieu sous forme de graphique circulaire
  const getStatsByLieu = () => {
    const lieuStats = events.reduce((acc, event) => {
      acc[event.lieu] = (acc[event.lieu] || 0) + 1
      return acc
    }, {})

    // Sort data by frequency for better visualization
    const sortedEntries = Object.entries(lieuStats).sort((a, b) => b[1] - a[1])

    const labels = sortedEntries.map((entry) => entry[0])
    const data = sortedEntries.map((entry) => entry[1])

    // More vibrant and accessible color palette
    const colorPalette = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
      "#6366f1",
      "#84cc16",
      "#14b8a6",
      "#a855f7",
      "#0ea5e9",
      "#22c55e",
      "#eab308",
    ]

    // Ensure we have enough colors by repeating the palette if needed
    const backgroundColors = labels.map((_, i) => colorPalette[i % colorPalette.length])

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
          borderColor: "white",
          borderWidth: 2,
        },
      ],
    }
  }

  return (
    <div className="app-container">
      <style jsx>{`
        .stat-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-top: 30px;
          transition: all 0.3s ease;
        }
        
        .stat-container:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        
        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .stat-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }
        
        .stat-info-badge {
          display: flex;
          align-items: center;
          background: #f0f9ff;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #0369a1;
        }
        
        .info-icon {
          margin-right: 6px;
        }
        
        .stat-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .stat-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        
        .stat-card-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #0369a1;
          margin-bottom: 5px;
        }
        
        .stat-card-label {
          font-size: 0.85rem;
          color: #64748b;
        }
        
        .stat-chart-container {
          height: 350px;
          position: relative;
          margin: 20px 0;
        }
        
        .no-data-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #64748b;
          text-align: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px dashed #cbd5e1;
        }
        
        .no-data-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          opacity: 0.7;
        }
        
        .stat-legend-help {
          text-align: center;
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 10px;
        }
        
        @media (max-width: 768px) {
          .stat-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .stat-info-badge {
            margin-top: 5px;
          }
          
          .stat-chart-container {
            height: 300px;
          }
        }
      `}</style>
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
          <EventForm refreshEvents={refreshEvents} editingEvent={editingEvent} setEditingEvent={setEditingEvent} />
        </div>

        <div className="event-list-container">
          <h2>Liste des Événements</h2>
          {loading ? (
            <div className="loading">Chargement des événements...</div>
          ) : events.length === 0 ? (
            <div className="no-events">
              Aucun événement trouvé.{" "}
              {search.nomEvent || search.lieu ? "Essayez un autre filtre." : "Ajoutez votre premier événement !"}
            </div>
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
          <div className="stat-header">
            <h2>Statistiques par Lieu</h2>
            <div className="stat-info-badge">
              <span className="info-icon">ℹ️</span>
              <span className="info-text">Ce graphique montre la répartition des événements par lieu</span>
            </div>
          </div>

          <div className="stat-summary">
            <div className="stat-card">
              <div className="stat-card-value">{events.length}</div>
              <div className="stat-card-label">Événements totaux</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{new Set(events.map((e) => e.lieu)).size}</div>
              <div className="stat-card-label">Lieux uniques</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">
                {events.length > 0
                  ? Object.entries(
                      events.reduce((acc, event) => {
                        acc[event.lieu] = (acc[event.lieu] || 0) + 1
                        return acc
                      }, {}),
                    ).sort((a, b) => b[1] - a[1])[0][0]
                  : "-"}
              </div>
              <div className="stat-card-label">Lieu le plus populaire</div>
            </div>
          </div>

          <div className="stat-chart-container">
            {events.length === 0 ? (
              <div className="no-data-message">
                <div className="no-data-icon">📊</div>
                <p>Aucune donnée disponible pour afficher les statistiques.</p>
                <p>Ajoutez des événements pour voir les statistiques apparaître ici.</p>
              </div>
            ) : (
              <Pie
                data={getStatsByLieu()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        boxWidth: 15,
                        padding: 15,
                        font: {
                          size: 12,
                        },
                        generateLabels: (chart) => {
                          const data = chart.data
                          if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                              const count = data.datasets[0].data[i]
                              const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
                              const percentage = Math.round((count / total) * 100)
                              return {
                                text: `${label} (${count} - ${percentage}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i,
                              }
                            })
                          }
                          return []
                        },
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0,0,0,0.8)",
                      padding: 10,
                      titleFont: {
                        size: 14,
                      },
                      bodyFont: {
                        size: 13,
                      },
                      callbacks: {
                        label: (context) => {
                          const label = context.label || ""
                          const value = context.raw || 0
                          const total = context.dataset.data.reduce((a, b) => a + b, 0)
                          const percentage = Math.round((value / total) * 100)
                          return `${label}: ${value} événements (${percentage}%)`
                        },
                      },
                    },
                    datalabels: {
                      display: true,
                      color: "#fff",
                      font: {
                        weight: "bold",
                        size: 11,
                      },
                      formatter: (value, ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = Math.round((value / total) * 100)
                        return percentage > 5 ? `${percentage}%` : ""
                      },
                    },
                  },
                  animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000,
                    easing: "easeOutQuart",
                  },
                }}
              />
            )}
          </div>

          <div className="stat-legend-help">
            <p>Cliquez sur une légende pour masquer/afficher cette catégorie</p>
          </div>
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
  )
}

export default Stat
