import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return { ...response, data: response.data.data, fullResponse: response.data };
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message;
    const errors = data?.errors;
    const err = new Error(message);
    err.status = status;
    err.errors = errors;
    err.originalResponse = error.response;
    return Promise.reject(err);
  }
);

export default axiosInstance;
