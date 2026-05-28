import api from './api';

export const descuentoService = {
  list: async () => {
    const response = await api.get('/descuentos');
    return response.data;
  },

  getByCode: async (code) => {
    const descuentos = await descuentoService.list();
    return descuentos.find(d => d.codigo === code && d.activo);
  },

  getById: async (id) => {
    const response = await api.get(`/descuentos/${id}`);
    return response.data;
  }
};
