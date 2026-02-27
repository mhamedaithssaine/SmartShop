import axiosInstance from './axiosInstance.js';

const unwrap = (res) => res?.data;

export const promoApi = {
  getByCode(code) {
    return axiosInstance.get(`/promo-codes/code/${encodeURIComponent(code)}`).then(unwrap);
  },

  getValid() {
    return axiosInstance.get('/promo-codes/valides').then(unwrap);
  },
};
