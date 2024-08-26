import React, { createContext, useState, useEffect } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import authService from '../services/authService.js';
import {router} from 'expo-router';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { getItem, setItem, removeItem } = useAsyncStorage('@user_token');

  // useEffect(() => {
  //   const loadUserData = async () => {
  //     setLoading(true);
  //     const token = await getItem();
  //     if (token) {
  //       const userData = await authService.getUserData(token);  // Fetch user data with token
  //       setUser(userData);
  //     }
  //     setLoading(false);
  //   };

  //   loadUserData();
  // }, []);

  const login = async (username, password) => {
    const loginData = await authService.login(username, password);
    await setItem(loginData.token);
    setUser(loginData.user);
    router.navigate('/home');
  };

  const logout = async () => {
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
