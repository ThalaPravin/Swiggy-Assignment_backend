// Centralized API configuration for Swiggy Dineout Sentinel AI
// Points to Render cloud backend in production, or localhost in development

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://swiggy-assignment-backend.onrender.com' : 'http://localhost:5000')
).replace(/\/+$/, '');

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
