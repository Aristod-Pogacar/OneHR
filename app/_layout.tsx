import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GlobalProvider } from "./Providers/GlobalProvider";

export default function RootLayout() {
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  return (
    <LinearGradient
      colors={["#0b0d2e", "#0e1a5c"]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
      <GlobalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Loading" /> */}
          <Stack.Screen name="Login_fingerprint" />
          <Stack.Screen name="Login_matricule" />
          <Stack.Screen name="Delete_fingerprint" />
          <Stack.Screen name="EnrollScreen" />
          <Stack.Screen name="LoginScreen" />
          <Stack.Screen name="Login_password" />
          <Stack.Screen name="Menu" />
          <Stack.Screen name="MenuConge" />
          <Stack.Screen name="CongeAnnuel_DateDebut" />
          <Stack.Screen name="CongeAnnuel_DateFin" />
          <Stack.Screen name="CongeAnnuel_Motif" />
          <Stack.Screen name="Permission_Reason" />
          <Stack.Screen name="Permission_Reason_step2" />
          <Stack.Screen name="Permission_StartingDate" />
          <Stack.Screen name="Permission_EndingDate" />
          <Stack.Screen name="Permission_ConfirmData" />
          <Stack.Screen name="Permission2h_StartingHour" />
          <Stack.Screen name="Permission2h_EndingHour" />
          <Stack.Screen name="Setting_matricule" />
          <Stack.Screen name="Setting_ip_address" />
          <Stack.Screen name="Admin_Login_email" />
          <Stack.Screen name="Admin_Login_password" />
          <Stack.Screen name="Admin_Menu" />
          <Stack.Screen name="Setting_Service_Medical" />
          <Stack.Screen name="MenuServiceMedical" />
          <Stack.Screen name="test" />
          <Stack.Screen name="index" />
        </Stack>
      </GlobalProvider>
      <StatusBar hidden />
      {/* <Stack screenOptions={{ headerShown: false }} /> */}
    </LinearGradient>
  );
}
