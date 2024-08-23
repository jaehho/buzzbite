import { Stack, useNavigation } from "expo-router";
import { useEffect, useState} from "react";
import NavBar from "../../components/NavBar";



export default function Layout() {
  return (
    <>
    <Stack screenOptions={{
        // Hide the header for all other routes.
        headerShown: false,
      }}>
      
    </Stack>
    <NavBar/>
    </>

  );
}
