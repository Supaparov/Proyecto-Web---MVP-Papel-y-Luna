import api from './api';

export const faltanteService = {
  list: async () => {
    const response = await api.get('/faltantes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/faltantes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/faltantes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/faltantes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/faltantes/${id}`);
    return response.data;
  },

  getReport: async () => {
    const response = await api.get('/faltantes/report');
    return response.data;
  }
};
