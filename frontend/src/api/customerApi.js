import axiosInstance from './axiosInstance.js';

const unwrap = (res) => res?.data;

export const customerApi = {
  getAll() {
    return axiosInstance.get('/customers').then(unwrap);
  },

  getById(id) {
    return axiosInstance.get(`/customers/${id}`).then(unwrap);
  },

  create(payload) {
    return axiosInstance.post('/customers/create', payload).then(unwrap);
  },

  update(id, payload) {
    return axiosInstance.put(`/customers/${id}`, payload).then(unwrap);
  },

  delete(id) {
    return axiosInstance.delete(`/customers/${id}`).then(unwrap);
  },

  getOrders(customerId) {
    return axiosInstance.get(`/commandes/client/${customerId}`).then(unwrap);
  },
};
