import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

const TOKEN_KEY = 'lumen-token';

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable (private mode) – session-only login */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

// Lets the auth layer react when the backend rejects our token
let unauthorizedHandler = null;
export const onUnauthorized = (handler) => {
  unauthorizedHandler = handler;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unified, human-friendly error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Something went wrong. Please try again.';
    const status = error.response?.status;

    if (error.response) {
      message = error.response.data?.message || `Request failed (${status}).`;
      const isAuthCall = error.config?.url?.startsWith('/api/auth/login') || error.config?.url?.startsWith('/api/auth/signup');
      if (status === 401 && !isAuthCall) {
        unauthorizedHandler?.();
      }
    } else if (error.request) {
      message = "We couldn't reach the server. Please check that the backend is running and try again.";
    } else if (error.message) {
      message = error.message;
    }

    const wrapped = new Error(message);
    wrapped.status = status;
    return Promise.reject(wrapped);
  }
);

export const authApi = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  signup: (fullName, email, password) => api.post('/api/auth/signup', { fullName, email, password }),
  me: () => api.get('/api/auth/me'),
};

export const documentApi = {
  uploadDocument: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/document/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    });
  },
  getDocument: () => api.get('/api/document'),
  deleteDocument: (id) => api.delete(`/api/document/${id}`),
};

export const chatApi = {
  askQuestion: (question) => api.post('/api/chat', { question }),
  getHistory: () => api.get('/api/chat/history'),
};

export default api;
