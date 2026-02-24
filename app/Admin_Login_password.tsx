import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import api from "./utils/axios";

async function compare(data: any): Promise<any> {
  try {
    const path = '/admin/compare';
    const response = await api.post(path, {
      matricule: data.matricule,
      password: data.password
    });

    return response.data; // 👍 toujours un return
  } catch (error) {
    console.log("Compare error:", error);
    return null; // 👍 ne retourne jamais undefined
  }
}
export default function Login_password() {
  const { bg1, bg2 } = useGlobal();

  const router = useRouter();
  const [password, setPassword] = useState(""); // stocke la date de début (texte)

  const onPress = () => {
    // get("" + prefixMatricule + password).then(value => {
    //   if(value) {
    //     console.log("stringify:", JSON.stringify(value));
        router.push({
          pathname: '/Admin_Menu',
          params: { 
            // user: JSON.stringify(value)
          },
        });
      // } else {
      //    Alert.alert(
      //     "Diso ny password",
      //     "Tsy misy ny password " + password + " tompoko!",
      //     [{ text: "OK", style: "default" }]
      //   );

      // }
    // })
  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
    <View className="flex-1 bg-transparent px-20 pt-4 justify-start">
      <View className="items-center justify-start mt-5 mb-0">
        <Text className="text-3xl font-bold">Paramètre</Text>
      </View>

      <View className="m-0 justify-center px-20">

        <Text className="text-lg mb-2">Mot de passe:</Text>
        <Pressable  >
          <TextInput
            value={password}
            placeholder="Mot de passe"
            autoFocus
            onChangeText={(text) => setPassword(text)}
            className={`w-full h-15 border rounded-md p-3 mb-3 bg-white text-3xl border-gray-300 shadow-black shadow`}
            secureTextEntry
          />
        </Pressable>
        <View className="flex-row justify-center">
          <Button fontSize="" onPress={() => onPress()} label="OK" className="mx-10" />
          <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
        </View>
      </View>
    </View>
    </LinearGradient>
  );
}
