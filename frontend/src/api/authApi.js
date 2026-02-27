import axiosInstance from './axiosInstance.js';

const unwrap = (res) => res?.data;

export const authApi = {
  login(username, password) {
    return axiosInstance.post('/auth/login', { username, password }).then(unwrap);
  },

  logout() {
    return axiosInstance.post('/auth/logout').then(unwrap);
  },

  me() {
    return axiosInstance.get('/auth/me').then(unwrap);
  },
};
