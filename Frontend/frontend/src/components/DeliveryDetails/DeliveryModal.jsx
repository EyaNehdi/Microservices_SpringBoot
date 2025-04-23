import React, { useEffect, useState } from "react";
import "./delivery.css";
import axios from "axios";

export const getDeliveryById = async (id) => {
  const response = await axios.get(
    `http://localhost:7000/deliveries/getDetails/${id}`
  );
  console.log(response.data);

  return response.data;
};

const DeliveryModal = ({ deliveryId, onClose }) => {
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    getDeliveryById(deliveryId).then(setDelivery).catch(console.error);
  }, [deliveryId]);

  if (!delivery) return null;

  const {
    address,
    deliveryDate,
    status,
    carrier,
    trackingNumber,
    notes,
    commande,
  } = delivery;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Delivery Details</h2>
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Date:</strong> {new Date(deliveryDate).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Carrier:</strong> {carrier}
        </p>
        <p>
          <strong>Tracking Number:</strong> {trackingNumber}
        </p>
        <p>
          <strong>Notes:</strong> {notes}
        </p>

        <hr style={{ margin: "12px 0" }} />

        <h3>Commande Info</h3>
        <p>
          <strong>Nom:</strong> {commande.nomCommande}
        </p>
        <p>
          <strong>Delivery Address:</strong> {commande.deliveryAddress}
        </p>
        <p>
          <strong>Total Price:</strong> {commande.totalPrice} DT
        </p>

        <h4>Products:</h4>
        {commande.produits && commande.produits.length > 0 ? (
          <ul>
            {commande.produits
              .filter((prod) => prod !== null) 
              .map((prod) => (
                <li key={prod.id}>
                  <strong>{prod.nomProduit}</strong> — {prod.prixUnitaire} DT
                  <br />
                  <small>{prod.description}</small>
                </li>
              ))}
          </ul>
        ) : (
          <p>No products available</p>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            backgroundColor: "#ef4444",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DeliveryModal;
