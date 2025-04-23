"use client";

import { useState, useEffect } from "react";
import ReclamationForm from "./ReclamationForm";
import axios from "axios";
import "../styles.css";

function ReclamationManagement() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReclamation, setEditingReclamation] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [reclamationToDelete, setReclamationToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jsPDFLoaded, setJsPDFLoaded] = useState(false); // Track jsPDF loading state
  const [sortOrder, setSortOrder] = useState("asc"); // Track sort order (asc/desc)

  // Dynamically load jsPDF script
  useEffect(() => {
    const loadJsPDF = async () => {
      if (window.jspdf?.jsPDF) {
        setJsPDFLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.async = true;
      script.onload = () => {
        console.log("jsPDF loaded successfully");
        setJsPDFLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load jsPDF");
        setJsPDFLoaded(false);
      };
      document.body.appendChild(script);
    };

    loadJsPDF();
  }, []);

  useEffect(() => {
    fetchReclamations();
  }, []);

  const fetchReclamations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:7000/reclamation/get");
      console.log("API response:", response.data);
      setReclamations(response.data);
    } catch (error) {
      console.error("Error fetching reclamations:", error);
      alert("Échec de récupération des réclamations. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const refreshReclamations = () => {
    fetchReclamations();
  };

  const handleEdit = (reclamation) => {
    setEditingReclamation(reclamation);
    document.querySelector(".reclamation-form-container").scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/reclamation/supp/${id}`);
      refreshReclamations();
      setShowConfirmDelete(false);
      setReclamationToDelete(null);
      showNotification("Réclamation supprimée avec succès!");
    } catch (error) {
      console.error("Error deleting reclamation:", error);
      alert("Échec de la suppression de la réclamation. Veuillez réessayer.");
    }
  };

  const handleDownload = (reclamation) => {
    if (!jsPDFLoaded || !window.jspdf?.jsPDF) {
      console.error("jsPDF is not loaded.");
      alert("Erreur: Impossible de générer le PDF. Assurez-vous que jsPDF est correctement chargé.");
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Détails de la Réclamation", 20, 20);
      doc.setFontSize(12);
      doc.text(`ID: ${reclamation.id}`, 20, 40);
      doc.text(`Titre: ${reclamation.titre || "N/A"}`, 20, 50);
      const description = reclamation.description || "N/A";
      const splitDescription = doc.splitTextToSize(`Description: ${description}`, 170);
      doc.text(splitDescription, 20, 60);
      const descriptionHeight = splitDescription.length * 10;
      doc.text(`Date: ${formatDate(reclamation.date)}`, 20, 60 + descriptionHeight);
      doc.text(`Type: ${reclamation.type_reclamation || "N/A"}`, 20, 70 + descriptionHeight);
      doc.save(`reclamation_${reclamation.id}.pdf`);
      showNotification("Réclamation téléchargée avec succès!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
    }
  };

  const confirmDelete = (reclamation) => {
    setReclamationToDelete(reclamation);
    setShowConfirmDelete(true);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setReclamationToDelete(null);
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const filteredReclamations = reclamations.filter((reclamation) => {
    const titre = reclamation.titre || "";
    const description = reclamation.description || "";
    return (
      titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort reclamations by date
  const sortedReclamations = [...filteredReclamations].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleSortByDate = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="app-container">
      <div className="app-header">
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
      </div>

      <div className="content-container">
        <div className="reclamation-form-container">
          <h2>{editingReclamation ? "Modifier la réclamation" : "Nouvelle réclamation"}</h2>
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
          ) : sortedReclamations.length === 0 ? (
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
                    <th onClick={handleSortByDate} style={{ cursor: "pointer" }}>
                      Date {sortOrder === "asc" ? "↑" : "↓"}
                    </th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReclamations.map((reclamation) => (
                    <tr key={reclamation.id}>
                      <td data-label="Titre">{reclamation.titre || "N/A"}</td>
                      <td data-label="Description" className="description-cell">
                        {reclamation.description || "N/A"}
                      </td>
                      <td data-label="Date">{formatDate(reclamation.date)}</td>
                      <td data-label="Type" className="type-cell">
                        {reclamation.type_reclamation || "N/A"}
                      </td>
                      <td data-label="Actions" className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEdit(reclamation)}>
                          Modifier
                        </button>
                        <button className="delete-btn" onClick={() => confirmDelete(reclamation)}>
                          Supprimer
                        </button>
                        <button className="download-btn" onClick={() => handleDownload(reclamation)}>
                          Télécharger
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
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>{reclamationToDelete?.titre || "cette réclamation"}</strong>?
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
  );
}


export default ReclamationManagement;