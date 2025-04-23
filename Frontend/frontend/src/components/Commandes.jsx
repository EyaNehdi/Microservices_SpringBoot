import { useEffect, useState } from "react";
import { useCommandeStore } from "../store/useCommandeStore";
import axios from "axios";
import { Trash, Plus, CheckCircle, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Commandes() {
  const { deleteCommande } = useCommandeStore();
  const { commandes, fetchAllCommandes, setCommandes } = useCommandeStore();
  const [sortField, setSortField] = useState("totalPrice"); // Default sorting by totalPrice
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order is ascending
  const navigate = useNavigate();
  const fetchCommandes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/commande/sort/${sortOrder}?field=${sortField}`
      );
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

  const handleExportPDF = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/commande/export",
        {
          responseType: "blob",
        }
      );

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
        responseType: "blob",
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
  const handleAddProducts = (orderId) => {
    navigate(`/products?commandeId=${orderId}`);
  };

  const handleConfirmOrder = (id) => {
    navigate(`/delivery/${id}`);
  };

  const handleUpdateCommande = (id) => {
    navigate(`/update-commande/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "16px" }}>
        Liste des Commandes
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={handleExportPDF}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            border: "1px solid #3b82f6", // blue-500
            color: "#3b82f6",
            borderRadius: "6px",
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#eff6ff")} // hover:bg-blue-100
          onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Exporter en PDF
        </button>

        <button
          onClick={handleExportExcel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            border: "1px solid #10b981", // green-500
            color: "#10b981",
            borderRadius: "6px",
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#d1fae5")} // hover:bg-green-100
          onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Exporter en Excel
        </button>

        <button
          onClick={handleSortAsc}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            border: "1px solid #10b981", // green-500
            color: "#10b981",
            borderRadius: "6px",
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#d1fae5")} // hover:bg-green-100
          onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Sort Asc
        </button>

        <button
          onClick={handleSortDesc}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            border: "1px solid #10b981", // green-500
            color: "#10b981",
            borderRadius: "6px",
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#d1fae5")} // hover:bg-green-100
          onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Sort Desc
        </button>
      </div>

      <div
        style={{
          overflowX: "auto",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <table style={{ minWidth: "100%", backgroundColor: "#ffffff" }}>
          <thead style={{ backgroundColor: "#f3f4f6" }}>
            <tr>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  color: "#4b5563",
                  marginRight: "8px",
                }}
              >
                Nom
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  color: "#4b5563",
                  marginRight: "8px",
                }}
              >
                Adresse
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  color: "#4b5563",
                  marginRight: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Prix Total
                </div>
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  color: "#4b5563",
                  marginRight: "8px",
                }}
              >
                Produits
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  color: "#4b5563",
                  marginRight: "8px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((commande) => (
              <tr
                key={commande._id}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  backgroundColor: "transparent",
                }}
              >
                <td style={{ padding: "8px", marginRight: "8px" }}>
                  {commande.nomCommande}
                </td>
                <td style={{ padding: "8px", marginRight: "8px" }}>
                  {commande.deliveryAddress}
                </td>
                <td style={{ padding: "8px", marginRight: "8px" }}>
                  {commande.totalPrice.toFixed(2)} €
                </td>
                <td style={{ padding: "8px", marginRight: "8px" }}>
                  {commande.productIds.length} produits
                </td>
                <td style={{ padding: "8px", marginRight: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={() => handleAddProducts(commande._id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px",
                        color: "#3b82f6", // blue-500
                        backgroundColor: "transparent",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#eff6ff")
                      } // hover:bg-blue-100
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                      title="Add Product"
                    >
                      <Plus size={18} />
                      <span>Add Products</span>
                    </button>

                    <button
                      onClick={() => handleConfirmOrder(commande._id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px",
                        color:
                          commande.productIds.length === 0
                            ? "#9ca3af"
                            : "#10b981",
                        backgroundColor: "transparent",
                        borderRadius: "6px",
                        cursor:
                          commande.productIds.length === 0
                            ? "not-allowed"
                            : "pointer",
                        transition: "background-color 0.2s",
                        opacity: commande.productIds.length === 0 ? 0.6 : 1,
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#d1fae5")
                      } // hover:bg-green-100
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                      disabled={commande.productIds.length === 0}
                      title="Confirm Order"
                    >
                      <CheckCircle size={18} />
                      <span>Confirm Order</span>
                    </button>

                    <button
                      onClick={() => handleUpdateCommande(commande._id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px",
                        color: "#10b981", // green-500
                        backgroundColor: "transparent",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#d1fae5")
                      } // hover:bg-green-100
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                      title="update"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(commande._id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px",
                        color: "#ef4444", // red-500
                        backgroundColor: "transparent",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#fee2e2")
                      } // hover:bg-red-100
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                      title="delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {commandes.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  Aucune commande trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Commandes;
