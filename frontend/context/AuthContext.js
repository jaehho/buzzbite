import React, { createContext, useState, useEffect } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import authService from '../services/authService.js';  // Assume this handles API calls

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { getItem, setItem, removeItem } = useAsyncStorage('@user_token');

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const token = await getItem();
      if (token) {
        const userData = await authService.getUserData(token);  // Fetch user data with token
        setUser(userData);
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const login = async (username, password) => {
    const token = await authService.login(username, password);
    await setItem(token);
    const userData = await authService.getUserData(token);
    setUser(userData);
  };

  const logout = async () => {
    await removeItem();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
