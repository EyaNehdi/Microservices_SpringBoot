import axios from 'axios';

const API_BASE_URL = "http://localhost:8089/produits"; // Your Spring Boot backend

export const getAllProducts = async () => {
    return axios.get(`${API_BASE_URL}/all`);
};

export const addProduct = async (product) => {
    return axios.post(`${API_BASE_URL}/add`, product);
};
