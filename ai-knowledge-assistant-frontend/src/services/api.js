import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      // Backend sent response with error status code
      message = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // Network error / Backend down
      message = 'Cannot connect to backend server at http://localhost:8080. Please ensure Spring Boot is running.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const documentApi = {
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/document/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
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