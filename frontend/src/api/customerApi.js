import axiosInstance from './axiosInstance.js';

export const customerApi = {
  getAll() {
    return axiosInstance.get('/customers');
  },

  getById(id) {
    return axiosInstance.get(`/customers/${id}`);
  },

  create(payload) {
    return axiosInstance.post('/customers/create', payload);
  },

  update(id, payload) {
    return axiosInstance.put(`/customers/${id}`, payload);
  },

  delete(id) {
    return axiosInstance.delete(`/customers/${id}`);
  },

  getOrders(customerId) {
    return axiosInstance.get(`/commandes/client/${customerId}`);
  },
};
