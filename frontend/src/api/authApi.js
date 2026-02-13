import axiosInstance from './axiosInstance.js';

export const authApi = {
  login(username, password) {
    return axiosInstance.post('/auth/login', { username, password });
  },

  logout() {
    return axiosInstance.post('/auth/logout');
  },

  me() {
    return axiosInstance.get('/auth/me');
  },
};
