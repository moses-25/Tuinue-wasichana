// src/services/api.js
// Centralized API service for backend integration
// Uses axios for HTTP requests

import axios from 'axios';

// Set base URL from environment variable or fallback
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (e.g., for auth tokens)
api.interceptors.request.use(
  (config) => {
    // Example: Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    // Example: Redirect to login on 401
    if (error.response && error.response.status === 401) {
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Example API methods
export const get = (url, config) => api.get(url, config);
export const post = (url, data, config) => api.post(url, data, config);
export const put = (url, data, config) => api.put(url, data, config);
export const del = (url, config) => api.delete(url, config);

export default api;
