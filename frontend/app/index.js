import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RootLayout() {

  const { user } = useContext(AuthContext);
  const loggedIn = false;
  
  if(user === null) {
    return <Redirect href="/login" />;
  }      
  return (
      <Redirect href="/home" />
    );
  
};