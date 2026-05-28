import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const notification = useNotificationStore.getState();
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      useAuthStore.getState().logout();
      notification.error('Sesión expirada. Por favor, inicia sesión de nuevo.');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      notification.error('No tienes permiso para realizar esta acción.');
    } else if (error.response?.status >= 400 && error.response?.status < 500) {
      // Errores del cliente
      const message = error.response.data?.error || error.response.data?.message || 'Error en la solicitud';
      notification.error(message);
    } else if (error.response?.status >= 500) {
      // Errores del servidor
      notification.error('Error del servidor. Por favor, intenta más tarde.');
    } else if (error.message === 'Network Error') {
      notification.error('Error de conexión. Verifica tu conexión a internet.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
