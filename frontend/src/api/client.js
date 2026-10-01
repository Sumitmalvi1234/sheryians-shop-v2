import axios from 'axios';

// Vite automatically swaps this based on whether you run npm run dev or build on Render
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Necessary for cookie-parser sessions
});

// Automatically inject JWT tokens into authorization headers if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
