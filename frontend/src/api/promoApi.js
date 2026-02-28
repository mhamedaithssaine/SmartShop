import axiosInstance from './axiosInstance.js';

const unwrap = (res) => res?.data;

export const promoApi = {
  getAll() {
    return axiosInstance.get('/promo-codes').then(unwrap);
  },

  getById(id) {
    return axiosInstance.get(`/promo-codes/${id}`).then(unwrap);
  },

  getByCode(code) {
    return axiosInstance.get(`/promo-codes/code/${encodeURIComponent(code)}`).then(unwrap);
  },

  getValid() {
    return axiosInstance.get('/promo-codes/valides').then(unwrap);
  },

  getActive() {
    return axiosInstance.get('/promo-codes/actifs').then(unwrap);
  },

  create(payload) {
    return axiosInstance.post('/promo-codes', payload).then(unwrap);
  },

  update(id, payload) {
    return axiosInstance.put(`/promo-codes/${id}`, payload).then(unwrap);
  },

  toggle(id) {
    return axiosInstance.patch(`/promo-codes/${id}/toggle`).then(unwrap);
  },

  delete(id) {
    return axiosInstance.delete(`/promo-codes/${id}`).then(unwrap);
  },
};
