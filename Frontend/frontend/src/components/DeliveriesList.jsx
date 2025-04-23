import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryModal from "./DeliveryDetails/DeliveryModal";
import { FileDown } from "lucide-react";

const BASE_URL = "http://localhost:7000/deliveries";

const DeliveriesList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");

  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

  const handleView = (delivery) => {
    setSelectedDeliveryId(delivery.id);
  };

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    fetchAllDeliveries();
  }, []);

  const fetchAllDeliveries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getAll`);
      setDeliveries(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      fetchAllDeliveries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (delivery) => {
    navigate(`/delivery/${null}`, { state: { delivery } });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedFilteredDeliveries = [...deliveries]
    .filter((delivery) =>
      Object.values(delivery)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const handleDownloadPdf = (id) => {
    axios
      .get(`${BASE_URL}/pdf/${id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const blob = response.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `delivery_${id}.pdf`;
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  };

  return (
    <>
      <div className="app-container">
        <div >
          <h1>Gestion des Réclamations</h1>
          <div />
          <div />

          <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>
            All Deliveries
          </h3>

          <input
            type="text"
            placeholder="Search deliveries..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["id", "status", "carrier"].map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      cursor: "pointer",
                      background:
                        sortConfig.key === key ? "#f0f0f0" : "#fafafa",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {key.toUpperCase()}
                    {sortConfig.key === key &&
                      (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                  </th>
                ))}
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredDeliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td style={tdStyle}>{delivery.id}</td>
                  <td style={tdStyle}>{delivery.status}</td>
                  <td style={tdStyle}>{delivery.carrier}</td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => handleView(delivery)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#f3f4f6", // soft gray
                          color: "#374151", // slate-700
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#e5e7eb")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#f3f4f6")
                        }
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleEdit(delivery)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#e0f2fe", // soft blue
                          color: "#0284c7", // blue-600
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#bae6fd")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#e0f2fe")
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(delivery.id)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #fca5a5",
                          backgroundColor: "#fee2e2", // soft red
                          color: "#b91c1c", // red-700
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#fecaca")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#fee2e2")
                        }
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(delivery.id)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#f3f4f6", // soft gray
                          color: "#374151", // slate-700
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "background-color 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#e5e7eb")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#f3f4f6")
                        }
                      >
                        <FileDown style={{ fontSize: "16px" }} />
                        Download PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedDeliveryId && (
            <DeliveryModal
              deliveryId={selectedDeliveryId}
              onClose={() => setSelectedDeliveryId(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px 12px",
  textAlign: "center",
  verticalAlign: "middle",
};

export default DeliveriesList;
