import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:7000/deliveries";
axios.defaults.withCredentials = true;
const initialDelivery = {
  commandeId: "",
  address: "",
  deliveryDate: "",
  status: "PENDING",
  carrier: "",
  trackingNumber: "",
  notes: "",
};

const DeliveryManager = () => {
  const [form, setForm] = useState(initialDelivery);
  const [deliveries, setDeliveries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchAllDeliveries();
  }, []);

  const fetchAllDeliveries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getAll`);
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/getById/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/create`, form);
      }
      setForm(initialDelivery);
      fetchAllDeliveries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (delivery) => {
    setForm(delivery);
    setEditingId(delivery.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      fetchAllDeliveries();
    } catch (err) {
      console.error(err);
    }
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Delivery Manager</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="commandeId"
          placeholder="Commande ID"
          value={form.commandeId}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          name="deliveryDate"
          type="datetime-local"
          value={form.deliveryDate}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="PENDING">PENDING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="IN_TRANSIT">IN_TRANSIT</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <input
          name="carrier"
          placeholder="Carrier"
          value={form.carrier}
          onChange={handleChange}
        />
        <input
          name="trackingNumber"
          placeholder="Tracking #"
          value={form.trackingNumber}
          onChange={handleChange}
        />
        <input
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && (
          <button
            onClick={() => {
              setForm(initialDelivery);
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>All Deliveries</h3>

      <input
        type="text"
        placeholder="Search deliveries..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["id", "commandeId", "address", "status", "carrier"].map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  cursor: "pointer",
                  background: sortConfig.key === key ? "#f0f0f0" : "#fafafa",
                }}
              >
                {key.toUpperCase()}
                {sortConfig.key === key &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
            ))}
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedFilteredDeliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td style={tdStyle}>{delivery.id}</td>
              <td style={tdStyle}>{delivery.commandeId}</td>
              <td style={tdStyle}>{delivery.address}</td>
              <td style={tdStyle}>{delivery.status}</td>
              <td style={tdStyle}>{delivery.carrier}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(delivery)} style={btnStyle}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(delivery.id)}
                  style={btnStyle}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
  };
  
  const btnStyle = {
    marginRight: "6px",
    padding: "4px 8px",
    cursor: "pointer",
  };

export default DeliveryManager;
