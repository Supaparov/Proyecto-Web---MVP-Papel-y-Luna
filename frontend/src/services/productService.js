import api from './api';

export const productService = {
  list: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/productos');
    const products = response.data;
    return products.filter(p =>
      p.nombre.toLowerCase().includes(query.toLowerCase()) ||
      p.sku?.toLowerCase().includes(query.toLowerCase())
    );
  },

  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/productos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/productos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  }
};
