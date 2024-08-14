import { Stack, useNavigation } from "expo-router";
import { useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import AnimatedSplash from "../components/AnimatedSplash";
import * as SplashScreen from 'expo-splash-screen';


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
    <Stack screenOptions={{
      // Hide the header for all other routes.
      headerShown: false,
    }}>
    </Stack>
  );
}
