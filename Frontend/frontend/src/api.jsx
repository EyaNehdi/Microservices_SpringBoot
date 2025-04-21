import axios from 'axios';

const API_BASE_URL = "http://localhost:8089/produits"; 
const Reclamation_BASE_URL = "http://localhost:8087/reclamation"; // Your Spring Boot backend
// Your Spring Boot backend

export const getAllProducts = async () => {
    return axios.get(`${API_BASE_URL}/all`);
};

export const addProduct = async (product) => {
    return axios.post(`${API_BASE_URL}/add`, product);
};


export const getAllReclamation = async () => {
    return axios.get(`${Reclamation_BASE_URL}/get`);
};

export const addReclamation = async (reclamation) => {
    return axios.post(`${Reclamation_BASE_URL}/ajout`, reclamation);
};

//Event

const API_EVENT_URL = "http://localhost:8088/event";
// ✅ Récupérer tous les événements
export const getAllEvents = async () => {
    try {
        const response = await axios.get(`${API_EVENT_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        throw error;
    }
};

// ✅ Ajouter un nouvel événement
export const addEvent = async (event) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add`, event);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'événement :", error);
        throw error;
    }
};

// ✅ Mettre à jour un événement existant
export const updateEvent = async (id, event) => {
    try {
        const response = await axios.put(`${API_EVENT_URL}/update/${id}`, event);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'événement :", error);
        throw error;
    }
};


// ✅ Supprimer un événement
export const deleteEvent = async (id) => {
    try {
        const response = await axios.delete(`${API_EVENT_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        throw error;
    }
};

// ✅ Rechercher des événements par nom et lieu
export const searchEvents = async (nomEvent, lieu) => {
    try {
        const response = await axios.get(`${API_EVENT_URL}/search`, {
            params: { nomEvent, lieu }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la recherche d'événements :", error);
        throw error;
    }
};


// ✅ Exporter les événements en PDF (fonction à connecter avec le backend)
export const exportPDF = async (events) => {
    try {
        const response = await axios.post(`${API_EVENT_URL}/export/pdf`, events, {
            responseType: "blob", // Important pour gérer le fichier binaire PDF
        });
        return response.data; // Contenu du fichier PDF (Blob)
    } catch (error) {
        console.error("Erreur lors de l'exportation PDF :", error);
        throw error;
    }
};

export const triggerReminderNotifications = async () => {
    try {
        const response = await axios.get("http://localhost:8088/event/trigger-reminders");
        return response.data;
    } catch (error) {
        console.error("Erreur lors du déclenchement des notifications :", error);
        throw error;
    }
};