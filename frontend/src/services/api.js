import axios from 'axios';
const API_BASE_URL = 'https://mindsync-backend-vnq6.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatAPI = {
  sendMessage: async (message, conversationHistory = []) => {
    const response = await api.post('/api/chat', {
      message,
      conversation_history: conversationHistory,
    });
    return response.data;
  },
};

export const tasksAPI = {
  getAll: async () => {
    const response = await api.get('/api/tasks');
    return response.data.tasks;
  },
  
  create: async (task) => {
    const response = await api.post('/api/tasks', task);
    return response.data.task;
  },
  
  update: async (taskId, task) => {
    const response = await api.put(`/api/tasks/${taskId}`, task);
    return response.data.task;
  },
  
  delete: async (taskId) => {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return response.data;
  },
  
  getSuggestions: async (task) => {
    const response = await api.post('/api/tasks/suggest', task);
    return response.data.suggestions;
  },
};

export const weatherAPI = {
  getWeather: async (city) => {
    const response = await api.get(`/api/weather/${city}`);
    return response.data;
  },
};
// News API
export const newsAPI = {
  getNews: async (category = 'technology', limit = 5) => {
    const response = await api.get(`/api/news?category=${category}&limit=${limit}`);
    return response.data.articles;
  },
};

export const authAPI = {
  signup: async (email, password) => {
    const response = await api.post('/api/auth/signup', { email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async (token) => {
    const response = await api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};
// Add token to all requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;