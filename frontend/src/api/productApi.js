import axiosInstance from './axiosInstance.js';

const unwrap = (res) => res?.data;

export const productApi = {
  getAll() {
    return axiosInstance.get('/products').then(unwrap);
  },

  getById(id) {
    return axiosInstance.get(`/products/${id}`).then(unwrap);
  },

  search(nom) {
    return axiosInstance.get('/products/search', { params: { nom } }).then(unwrap);
  },

  create(payload) {
    return axiosInstance.post('/products', payload).then(unwrap);
  },

  update(id, payload) {
    return axiosInstance.put(`/products/${id}`, payload).then(unwrap);
  },

  delete(id) {
    return axiosInstance.delete(`/products/${id}`).then(unwrap);
  },
};
