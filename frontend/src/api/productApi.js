import axiosInstance from './axiosInstance.js';

export const productApi = {
  getAll() {
    return axiosInstance.get('/products');
  },

  getById(id) {
    return axiosInstance.get(`/products/${id}`);
  },

  search(nom) {
    return axiosInstance.get('/products/search', { params: { nom } });
  },

  create(payload) {
    return axiosInstance.post('/products', payload);
  },

  update(id, payload) {
    return axiosInstance.put(`/products/${id}`, payload);
  },

  delete(id) {
    return axiosInstance.delete(`/products/${id}`);
  },
};
