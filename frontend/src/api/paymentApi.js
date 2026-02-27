import axiosInstance from './axiosInstance.js';

const unwrap = (res) => res?.data;

export const paymentApi = {
  getByOrder(commandeId) {
    return axiosInstance.get(`/commandes/${commandeId}/paiements`).then(unwrap);
  },

  create(commandeId, payload) {
    return axiosInstance.post(`/commandes/${commandeId}/paiements`, payload).then(unwrap);
  },

  updateStatus(paiementId, payload) {
    return axiosInstance.put(`/paiements/${paiementId}/statut`, payload).then(unwrap);
  },
};
