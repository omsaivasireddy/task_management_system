import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getSubtasks = (taskId) => api.get(`/tasks/${taskId}/subtasks`);
export const createSubtask = (taskId, subtaskData) => 
  api.post(`/tasks/${taskId}/subtasks`, subtaskData);
export const updateSubtask = (taskId, subtaskId, subtaskData) => 
  api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
export const deleteSubtask = (taskId, subtaskId) => 
  api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);

export default api;