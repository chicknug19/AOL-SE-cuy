import axios from 'axios'; // INI YANG BENAR

// Mengambil URL dari file .env (Vercel). 
const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7123/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor: Menambahkan JWT Token otomatis ke setiap request (jika user sudah login)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;