import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params || '');
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors, loading states, token expiry (401)
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.response?.config?.url || '';

    console.error(`[API] ❌ ${status} ${url}`, error.response?.data?.message || error.message);

    // Auto logout on 401 (token expired/invalid) — skip for auth endpoints
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/me') || url.includes('/users/add');
    if (status === 401 && !isAuthEndpoint) {
      console.warn('[API] 401 Unauthorized — auto logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export default api;
