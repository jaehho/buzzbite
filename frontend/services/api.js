import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sessionService from './sessionService';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your actual API base URL
  timeout: 1000000, // Set a timeout for requests
});

// Request interceptor to add the token to each request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@user_token');
    if (token) {

      config.headers.Authorization = `Token ${token}`;
      // console.log("Requesting...", JSON.stringify(config, null, 2));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); 
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the response status is 401, it means the token is invalid or expired
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Attempt to refresh the token
      // const newToken = await sessionService.refreshToken();
      // if (newToken) {
      //   // Set the new token in the header and retry the original request
      //   axios.defaults.headers.common['Authorization'] = `${newToken}`;
      //   return api(originalRequest);
      // }
    }

    return Promise.reject(error);
  }
);

export default api;
