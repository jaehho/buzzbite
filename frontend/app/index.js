import { Redirect } from "expo-router";
import HomeScreen from "./home";

export default function RootLayout() {

  const loggedIn = false;
  if(!loggedIn) {
    return <Redirect href="/login" />;
  }
  return (
  <HomeScreen/>
  )
};