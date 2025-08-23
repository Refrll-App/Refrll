

import axios from 'axios';
import useAuthStore from '../store/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

const refreshInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];
let isLoggingOut = false;

const processQueue = (error, response = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(response);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isLoggedIn = useAuthStore.getState().isLoggedIn || false;

    // Skip if logging out or not logged in
    if (isLoggingOut || !isLoggedIn) {
      return Promise.reject(error);
    }

    // Skip refresh logic for login or refresh-token requests themselves
    if (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry && isLoggedIn) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;
    
      try {
        // Use separate instance without interceptor for refresh to avoid loop
        const refreshResponse = await refreshInstance.get('/api/auth/refresh-token');

        useAuthStore.getState().setLoggedIn(true);

        isRefreshing = false;
        processQueue(null, refreshResponse);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        useAuthStore.getState().clearAuth();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

export const markLoggingOut = () => {
  isLoggingOut = true;
  failedQueue = [];
};

