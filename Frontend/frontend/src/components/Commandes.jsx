import { useEffect, useState } from "react";
import { useCommandeStore } from "../store/useCommandeStore";
import Commande from "./Commande";
import axios from 'axios';

function Commandes() {

    const {deleteCommande } = useCommandeStore();
    const { commandes, fetchAllCommandes , setCommandes } = useCommandeStore();
    const [sortField, setSortField] = useState("totalPrice"); // Default sorting by totalPrice
    const [sortOrder, setSortOrder] = useState("asc"); // Default sort order is ascending
    const fetchCommandes = async () => {
      try {
          const response = await axios.get(`http://localhost:7000/commande/sort/${sortOrder}?field=${sortField}`);
          setCommandes(response.data);
      } catch (error) {
          console.error("Error fetching commandes:", error);
      }
  };

  useEffect(() => {
    fetchCommandes();
  }, [sortField, sortOrder]);

  const handleSortAsc = () => {
    setSortOrder("asc");
  };

  const handleSortDesc = () => {
    setSortOrder("desc");
  };


    const handleDelete = async (id) => {
        try {
            await deleteCommande(id);
            console.log("Attempting to delete commande with ID:", id);
            fetchAllCommandes();
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };
    //export pdf
    const handleExportPDF = async () => {
      try {
          // Call the backend to get the PDF file as a Blob
          const response = await axios.get("http://localhost:7000/commande/export", {
              responseType: "blob", // Make sure Axios knows the response is a Blob
          });

  const handleExportPDF = async () => {
    try {
      const response = await axios.get("http://localhost:8066/commande/export", {
        responseType: "blob",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(response.data);
      link.download = "commandes_list.pdf";
      link.click();
    } catch (error) {
      console.error("Error during PDF export:", error);
    }
  };

// Export Excel functionality
const handleExportExcel = async () => {
  try {
    console.log("Attempting to export Excel");
    const response = await axios.get("http://localhost:7000/commande/excel", {
      responseType: "blob"
    });
    console.log("Excel export successful", response);
    
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(response.data);
    link.download = "commandes_list.xlsx";
    link.click();
  } catch (error) {
    console.error("Error during Excel export:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Liste des Commandes</h1>

      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <button onClick={handleExportPDF} className="btn btn-outline-primary">
          📄 Exporter en PDF
        </button>
        <button onClick={handleExportExcel} className="btn btn-outline-success">
          📊 Exporter en Excel
        </button>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-4">
        <button onClick={handleSortAsc} className="btn btn-secondary btn-sm">
          Trier ↑
        </button>
        <button onClick={handleSortDesc} className="btn btn-secondary btn-sm">
          Trier ↓
        </button>
      </div>

      <div className="row">
        {commandes.map((commande, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
            <Commande
              commande={commande}
              handleDelete={() => { handleDelete(commande._id) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Commandes;
