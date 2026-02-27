import axiosInstance from './axiosInstance.js';

const unwrap = (res) => res?.data;

export const orderApi = {
  getAll(params = {}) {
    return axiosInstance.get('/commandes', { params }).then(unwrap);
  },

  getById(id) {
    return axiosInstance.get(`/commandes/${id}`).then(unwrap);
  },

  create(payload) {
    return axiosInstance.post('/commandes', payload).then(unwrap);
  },

  confirm(id) {
    return axiosInstance.post(`/commandes/${id}/confirmer`).then(unwrap);
  },

  cancel(id) {
    return axiosInstance.post(`/commandes/${id}/annuler`).then(unwrap);
  },
};
