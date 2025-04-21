"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

function ReclamationStatistics() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReclamations();
  }, []);

  const fetchReclamations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8087/reclamation/get");
      setReclamations(response.data);
    } catch (error) {
      console.error("Error fetching reclamations:", error);
      setError("Échec de récupération des réclamations. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  


  // Calculate statistics
  const totalReclamations = reclamations.length;

  // Group by type_reclamation
  const typeStats = reclamations.reduce((acc, reclamation) => {
    const type = reclamation.type_reclamation || "Non spécifié";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Group by month/year
  const monthlyStats = reclamations.reduce((acc, reclamation) => {
    const date = new Date(reclamation.date);
    if (isNaN(date.getTime())) return acc; // Skip invalid dates
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the bar chart (type distribution)
  const maxTypeCount = Math.max(...Object.values(typeStats), 1); // Avoid division by 0
  const typeChartData = Object.entries(typeStats).map(([type, count]) => ({
    type,
    count,
    percentage: (count / maxTypeCount) * 100, // For bar width
  }));

  // Sort monthly stats by date
  const sortedMonthlyStats = Object.entries(monthlyStats).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Statistiques des Réclamations</h1>
      </div>

      <div className="content-container">
        {loading ? (
          <div className="loading">Chargement des statistiques...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : totalReclamations === 0 ? (
          <div className="no-reclamations">Aucune réclamation trouvée.</div>
        ) : (
          <div className="statistics-container">
            {/* Total Reclamations */}
            <div className="stat-card">
              <h3>Nombre total de réclamations</h3>
              <p className="stat-value">{totalReclamations}</p>
            </div>

            {/* Reclamations by Type */}
            <div className="stat-card">
              <h3>Répartition par type</h3>
              <div className="bar-chart">
                {typeChartData.map(({ type, count, percentage }) => (
                  <div key={type} className="bar-chart-item">
                    <span className="bar-label">{type}: {count}</span>
                    <div className="bar" style={{ width: `${percentage}%` }}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reclamations by Month */}
            <div className="stat-card">
              <h3>Réclamations par mois</h3>
              <ul className="monthly-stats">
                {sortedMonthlyStats.map(([monthYear, count]) => (
                  <li key={monthYear}>
                    {monthYear}: {count} réclamation{count > 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReclamationStatistics;