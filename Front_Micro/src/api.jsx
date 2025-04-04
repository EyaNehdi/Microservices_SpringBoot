import axios from 'axios';

const API_BASE_URL = "http://localhost:8087/reclamation"; // Your Spring Boot backend

export const getAllReclamation = async () => {
    return axios.get(`${API_BASE_URL}/get`);
};

export const addReclamation = async (reclamation) => {
    return axios.post(`${API_BASE_URL}/ajout`, reclamation);
};
