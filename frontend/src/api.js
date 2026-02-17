import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? 'https://gamesphere-2.onrender.com/api'
    : '/api',
  headers: { 'Content-Type': 'application/json' }
});

try {
  const token = typeof localStorage !== 'undefined' && localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
} catch (_) { }

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
