import { Stack, useNavigation } from "expo-router";
import { useContext, useEffect, useState} from "react";
import { Text } from "react-native";
import NavBar from "../components/NavBar";
import AnimatedSplash from "../components/AnimatedSplash";
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, AuthContext } from "../context/AuthContext";



export default function RootLayout() {
const [appReady, setAppReady] = useState(false);


useEffect(() => {
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sleep(2000).then(() => {
    setAppReady(true);
  });
}, []);

if(!appReady) {
  return <AnimatedSplash/>
}
  return (
    <AuthProvider>
      <Stack screenOptions={{

        // Hide the header for all other routes.
        headerShown: false,
      }}>
      
      </Stack>
    </AuthProvider>

  );
}
