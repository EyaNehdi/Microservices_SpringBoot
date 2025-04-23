import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BASE_URL = "http://localhost:7000/deliveries";

const initialDelivery = {
  deliveryDate: "",
  status: "PENDING",
  carrier: "",
  trackingNumber: "",
  notes: "",
};

const DeliveryManager = () => {
  const { commandeId } = useParams();
  const location = useLocation();
  const delivery = location.state?.delivery;
  const [form, setForm] = useState(
    delivery ? { ...delivery } : initialDelivery
  );
  const [editingId, setEditingId] = useState(delivery ? true : false);
  const navigate = useNavigate();
  console.log(delivery);

  axios.defaults.withCredentials = true;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/getById/${form.id}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/create/${commandeId}`, form);
      }
      setForm(initialDelivery);
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/deliveries");
    }
  };
  const isFormValid =
    form.deliveryDate &&
    form.status &&
    form.carrier &&
    form.trackingNumber;
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Delivery Manager</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "500px",
          marginInline: "auto",
          padding: "24px",
          border: "1px solid #ccc",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          backgroundColor: "#f9f9f9",
        }}
      >

        <label
          style={{ display: "flex", flexDirection: "column", fontWeight: 500 }}
        >
          Delivery Date
          <input
            name="deliveryDate"
            type="datetime-local"
            value={form.deliveryDate}
            onChange={handleChange}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label
          style={{ display: "flex", flexDirection: "column", fontWeight: 500 }}
        >
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="PENDING">PENDING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="IN_TRANSIT">IN_TRANSIT</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </label>

        <label
          style={{ display: "flex", flexDirection: "column", fontWeight: 500 }}
        >
          Carrier
          <input
            name="carrier"
            placeholder="Carrier (e.g., DHL, UPS)"
            value={form.carrier}
            onChange={handleChange}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label
          style={{ display: "flex", flexDirection: "column", fontWeight: 500 }}
        >
          Tracking Number
          <input
            name="trackingNumber"
            placeholder="Tracking #"
            value={form.trackingNumber}
            onChange={handleChange}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label
          style={{ display: "flex", flexDirection: "column", fontWeight: 500 }}
        >
          Notes
          <input
            name="notes"
            placeholder="Additional notes"
            value={form.notes}
            onChange={handleChange}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        <div
          style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
        >
          <button
            disabled={!isFormValid}
            type="submit"
            style={{
              padding: "10px 16px",
              backgroundColor: isFormValid ? "#4CAF50" : "#a5d6a7",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
          >
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                navigate("/deliveries");
              }}
              style={{
                padding: "10px 16px",
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DeliveryManager;
