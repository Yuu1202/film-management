import axios from "axios";

// Buat instance axios dengan base URL dari env
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Otomatis sisipkan token JWT ke setiap request kalau ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;