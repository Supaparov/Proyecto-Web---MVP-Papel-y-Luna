import api from './api';

export const ventaService = {
  create: async (data) => {
    const response = await api.post('/ventas', data);
    return response.data;
  },

  list: async () => {
    const response = await api.get('/ventas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/ventas/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/ventas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.post(`/ventas/${id}/reembolso`);
    return response.data;
  }
};
