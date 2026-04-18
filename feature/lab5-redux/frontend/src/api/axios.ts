import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔍 Interceptor token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔍 Interceptor headers:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;