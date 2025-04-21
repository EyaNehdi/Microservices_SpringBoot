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
