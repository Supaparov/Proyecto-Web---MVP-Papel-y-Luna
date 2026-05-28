import create from 'zustand';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: (() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch {
        return null;
      }
    }
    return null;
  })(),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (token) => {
    try {
      const user = jwtDecode(token);
      localStorage.setItem('token', token);
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      console.error('Error decodificando token:', error);
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  isAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'ADMIN';
  },

  isCashier: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'CAJERO';
  }
}));
