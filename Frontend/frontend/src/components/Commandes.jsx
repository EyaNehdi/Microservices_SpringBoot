import { useEffect,useState } from "react";
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
          const response = await axios.get(`http://localhost:8066/commande/sort/${sortOrder}?field=${sortField}`);
          setCommandes(response.data);
      } catch (error) {
          console.error("Error fetching commandes:", error);
      }
  };
  useEffect(() => {
    fetchCommandes();
}, [sortField, sortOrder]); // Re-run the effect when sortField or sortOrder changes

   // Handle ascending sort
   const handleSortAsc = () => {
    setSortOrder("asc"); // Set to ascending
};

// Handle descending sort
const handleSortDesc = () => {
    setSortOrder("desc"); // Set to descending
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
          const response = await axios.get("http://localhost:8066/commande/export", {
              responseType: "blob", // Make sure Axios knows the response is a Blob
          });

          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(response.data);
          link.download = "commandes_list.pdf"; // Specify the file name
          link.click();
      } catch (error) {
          console.error("Error during PDF export:", error);
      }
  };
// Export Excel functionality
const handleExportExcel = async () => {
  try {
    console.log("Attempting to export Excel");
    const response = await axios.get("http://localhost:8066/commande/excel", {
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
  }
};
  return (
    <div>
       <h1>List des commandes</h1>
       {/* Button to export PDF */}
       <button onClick={handleExportPDF} className="btn btn-primary mb-4">
                Exporter les commandes en PDF
            </button>
            {/* Button to export Excel */}
            <button onClick={handleExportExcel} className="btn btn-success mb-4">
                Exporter les commandes en Excel
            </button>

            <div>
                <button onClick={handleSortAsc}>Sort Ascending</button>
                <button onClick={handleSortDesc}>Sort Descending</button>
            </div>
        <div className="d-flex flex-wrap justify-content-start">
        {commandes.map((commande, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2" key={index}>
            <Commande 
              commande={commande} 
               handleDelete={() => {handleDelete(commande._id)} }
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Commandes
