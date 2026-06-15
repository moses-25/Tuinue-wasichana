// src/services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://your-backend-api.com/api", // replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for auth token, error handling, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from context/state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    if (error.response && error.response.status === 401) {
      // handle unauthorized, e.g., redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
