import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { UserProvider } from "./contexts/UserContext";

export default function RootLayout() {

  return (
    <LinearGradient
      colors={["#DEEFFF", "#C3EFFF"]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login_matricule" />
          <Stack.Screen name="LoginScreen" />
          <Stack.Screen name="Login_password" />
          <Stack.Screen name="Menu" />
          <Stack.Screen name="MenuConge" />
          <Stack.Screen name="CongeAnnuel_DateDebut" />
          <Stack.Screen name="CongeAnnuel_DateFin" />
          <Stack.Screen name="CongeAnnuel_Motif" />
          <Stack.Screen name="Permission_Reason" />
          <Stack.Screen name="Permission_StartingDate" />
          <Stack.Screen name="Permission_EndingDate" />
          <Stack.Screen name="Permission_ConfirmData" />
          <Stack.Screen name="test" />
          <Stack.Screen name="index" />
        </Stack>
      </UserProvider>
    </LinearGradient>
  );
}
