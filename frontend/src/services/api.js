import axios from 'axios'; 

// UBAH 5173 MENJADI 7021 DI BAWAH INI
const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7021/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor: Menambahkan JWT Token otomatis ke setiap request
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