import { Stack, useNavigation } from "expo-router";
import { useEffect, useState, useContext} from "react";
import { Text } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import NavBar from "../../components/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Layout() {

  const {user} = useContext(AuthContext);
  return (
    <>

    <Stack screenOptions={{
        // Hide the header for all other routes.
        headerShown: false,
      }}>
      
    </Stack>
    <Text style ={{position: 'absolute', top: 10, left: 10, fontSize: 50, color: "purple"}}>{user}</Text>
    <NavBar/>
    </>

  );
}
