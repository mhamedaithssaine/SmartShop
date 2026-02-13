import axiosInstance from './axiosInstance.js';

export const orderApi = {
  getAll(params = {}) {
    return axiosInstance.get('/commandes', { params });
  },

  getById(id) {
    return axiosInstance.get(`/commandes/${id}`);
  },

  create(payload) {
    return axiosInstance.post('/commandes', payload);
  },

  confirm(id) {
    return axiosInstance.post(`/commandes/${id}/confirmer`);
  },

  cancel(id) {
    return axiosInstance.post(`/commandes/${id}/annuler`);
  },
};
