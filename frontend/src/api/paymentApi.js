import axiosInstance from './axiosInstance.js';

export const paymentApi = {
  getByOrder(commandeId) {
    return axiosInstance.get(`/commandes/${commandeId}/paiements`);
  },

  create(commandeId, payload) {
    return axiosInstance.post(`/commandes/${commandeId}/paiements`, payload);
  },

  updateStatus(paiementId, payload) {
    return axiosInstance.put(`/paiements/${paiementId}/statut`, payload);
  },
};
