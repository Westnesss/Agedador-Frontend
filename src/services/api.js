import axios from "axios";

// Configura la URL base del backend
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Cambia esta URL según sea necesario
});

export default api;