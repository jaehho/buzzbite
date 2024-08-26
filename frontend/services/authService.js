import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigation} from 'expo-router';

const API_BASE_URL = 'http://localhost:8000';

const authService = {
  login: async (username, password) => {
    try {
      console.log("Attempting Login:...", username, password)
      const response = await axios.post(`http://localhost:8000/users/api-token-auth/`, {
        username, password,
      });
      console.log(response.data);
      const { token } = response.data;
      await AsyncStorage.setItem('@user_token', token);
      return {token: token, user: username};

    } catch (error) {
      console.log(error);
      throw new Error('Login failed: ' + error.response.data.message);
    }
  },
  
  signup: async (username, email, password) => {
    try {
      // const response = await axios.post(`${API_BASE_URL}/register/`, {
      //   username,
      //   email,
      //   password,
      // });

      // const { token, user } = response.data;

      const { token, user} = {token: "testtoken", user: "testuser"};
      await AsyncStorage.setItem('@user_token', token);
      return user;
    } catch (error) {
      throw new Error('Signup failed: ' + error.response.data.message);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('@user_token');
    } catch (error) {
      throw new Error('Logout failed: ' + error.message);
    }
    navigation.reset('/login');
  },

  getUserData: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.user;
    } catch (error) {
      throw new Error('Failed to fetch user data: ' + error.response.data.message);
    }
  },
};

export default authService;
