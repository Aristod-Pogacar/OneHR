import { useFonts } from 'expo-font';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './components/Button';
import { Logo } from './components/Logo';

export default function LoginScreen() {
  // const { setUsername } = useUser();

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tempusername, settempUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    // Logique de connexion à implémenter ici
    console.log('Nom d\'utilisateur:', tempusername);
    console.log('Mot de passe:', password);
    // setUsername(tempusername);
    router.push('/Menu');
  };
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

  return (
    <LinearGradient
      colors={["#DEEFFF", "#C3EFFF"]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
      <View
        className="flex-1 w-full self-center items-center justify-center rounded-lg"
        style={{
          marginTop: insets.top,
          marginBottom: insets.bottom,
        }}
      >
        <View className='w-full max-w-md self-center items-start justify-start bg-white rounded-lg shadow-lg overflow-hidden'>
      <LinearGradient
        colors={["#ffffff", "#d9d9d9"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
        className="w-full h-full p-5 items-center justify-start"
      >
          <Logo />
          <Text className="text-3xl font-bold mb-3 font-museo">Login</Text>

          <View className="w-full mb-4">
            <Text className="text-gray-600 mb-1">Email:</Text>
            <TextInput
              className="w-full h-12 border border-gray-300 rounded-md p-3 text-base bg-gray-100"
              onChangeText={settempUsername}
              value={tempusername}
              placeholder="exemple@aquarabe.mg"
              autoCapitalize="none"
            />
          </View>
{/* 
          <View className="w-full mb-6">
            <Text className="text-gray-600 mb-1">Teny miafina:</Text>
            <TextInput
              className="w-full h-12 border border-gray-300 rounded-md p-3 text-base bg-gray-100"
              onChangeText={setPassword}
              value={password}
              placeholder="Ampidiro eto ny teny miafina"
              secureTextEntry
            />
          </View> */}

          <Button onPress={handleLogin} label="Suivant" />

          {/* <TouchableOpacity>
            <Text className="text-sm text-sky-600">Adino ny teny miafina ?</Text>
          </TouchableOpacity> */}

      </LinearGradient>
      </View>
      </View>
    </LinearGradient>
  );
};