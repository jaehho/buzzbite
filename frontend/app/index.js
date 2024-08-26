import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {

  const { user } = useContext(AuthContext);
  const token = AsyncStorage.getItem('@user_token');
  
  if(user === null) {
    return <Redirect href="/login" />;
  }      
  return (
      <Redirect href="/home" />
    );
  
};