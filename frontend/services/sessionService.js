import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define your API endpoint base URL
const API_BASE_URL = 'http://localhost:8000';

const sessionService = {
  refreshToken: async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      if (!token) throw new Error('No token found');

      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { newToken } = response.data;
      await AsyncStorage.setItem('@user_token', newToken);
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null; // Return null if refreshing the token fails
    }
  },

  validateSession: async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      if (!token) return false;

      const response = await axios.get(`${API_BASE_URL}/auth/validate-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.valid;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false; // Return false if validation fails
    }
  },
};

export default sessionService;
