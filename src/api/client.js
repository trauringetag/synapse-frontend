import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов: добавляем JWT токен
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик ответов: обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Если получили 401 (Unauthorized)
      if (error.response.status === 401) {
        // Проверяем, НЕ является ли это запросом на логин или регистрацию
        const isAuthRequest = 
          error.config.url.includes('/auth/login') || 
          error.config.url.includes('/auth/register') ||
          error.config.url.includes('/auth/register-admin');

        // Перенаправляем на логин ТОЛЬКО если это не попытка входа, 
        // а например, запрос данных с истекшим токеном
        if (!isAuthRequest) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;