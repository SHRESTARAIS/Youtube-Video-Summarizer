import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For development - change this to your deployed backend URL
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Error getting auth token:', error);
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('username');
      } catch (storageError) {
        console.warn('Error clearing storage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;