import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useGlobal } from './Providers/GlobalProvider';
import { Button } from "./components/Button";
import { ButtonSecondary } from './components/ButtonSecondary';
import api from "./utils/axios";

async function get(employee:string) {
  var results
  const path = '/employee/' + employee
  console.log("path:", path);
  
  await api.get(path).then(value => {results = value.data});
  
  return results
}

export default function Login_matricule() {
  const { bg1, bg2 } = useGlobal();

  const black = "black";
  const blue = "blue";
    
  const router = useRouter();
  const [email, setEmail] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné

  const onPress = () => {
    // get("" + prefixMatricule + email).then(value => {
    //   if(value) {
    //     console.log("stringify:", JSON.stringify(value));
        router.push({
          pathname: '/Admin_Login_password',
          params: { 
            // user: JSON.stringify(value)
          },
        });
      // } else {
      //    Alert.alert(
      //     "Diso ny email",
      //     "Tsy misy ny email " + email + " tompoko!",
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

        <Text className="text-lg mb-2">Email:</Text>
        <Pressable onPress={() => setActiveField("start")} >
          <TextInput
            value={email}
            placeholder="exemple@aquarabe.mg"
            autoFocus
            onChangeText={(text) => setEmail(text)}
            className={`w-full h-15 border rounded-md p-3 mb-3 bg-white text-3xl border-gray-300 shadow-black shadow`}
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
