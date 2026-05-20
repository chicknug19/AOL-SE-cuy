import axios from 'axios'; // INI YANG BENAR

// Ganti port localhost ini sesuai dengan port backend ASP.NET kamu!
const BASE_URL = 'https://localhost:7123/api';

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