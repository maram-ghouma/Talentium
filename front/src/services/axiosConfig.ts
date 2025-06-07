import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('Sending token:', token); // Debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);
/*api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    if (status === 403) {
      window.location.href = '/*';
    } else if (status === 404) {
      window.location.href = '/*'; 
    }

    return Promise.reject(error);
  }
);*/

export default api;