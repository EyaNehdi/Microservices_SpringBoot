import axios from 'axios';

// ✅ Correct backend URL for local dev
const url = "http://localhost:8066/commande";

// Get all commandes
export const getAllCommandes = async () => {
    return await axios.get(`${url}/all`);
};

// Get specific commande by ID
export const getCommandeById = async (id) => {
    return await axios.get(`${url}/get/${id}`);
};

// Add new commande
export const addCommande = async (commande) => {
    return await axios.post(`${url}/add`, commande); // ✅ updated
};

// Update existing commande
export const editCommande = async (id, commande) => {
    return await axios.put(`${url}/update/${id}`, commande); // ✅ updated
};

// Delete commande
export const deleteCommande = async (id) => {
    return await axios.delete(`${url}/delete/${id}`);
};
