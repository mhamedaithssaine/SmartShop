import axiosInstance from './axiosInstance.js';

export const promoApi = {
  getByCode(code) {
    return axiosInstance.get(`/promo-codes/code/${encodeURIComponent(code)}`);
  },

  getValid() {
    return axiosInstance.get('/promo-codes/valides');
  },
};
