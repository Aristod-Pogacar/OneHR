// import { Text, View } from "react-native";
// import 'nativewind/tailwind.css';
import { useFonts } from 'expo-font';
import { Redirect } from 'expo-router';
import { verifyInstallation } from 'nativewind';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import '../global.css';
// import { useAuth } from "./_layout";

export default function Index() {
  let [fontsLoaded] = useFonts({
    MuseoModerno_400Regular: require('../assets/fonts/MuseoModerno-Regular.ttf'),
    MuseoModerno_700Bold: require('../assets/fonts/MuseoModerno-Bold.ttf'),
    // Add other MuseoModerno weights/styles you want to use
  });
  
  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  verifyInstallation();
// const { login } = useAuth();
  return <Redirect href="/Login_matricule" />
  // return <Redirect href="/LoginScreen" />
}
