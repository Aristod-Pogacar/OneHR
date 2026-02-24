import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";

export default function Setting_matricule() {
  const router = useRouter();

  const { prefixMatricule, setPrefixMatricule, bg1, bg2 } = useGlobal();

  const [matricule, setMatricule] = useState(prefixMatricule);

  const onClick = () => {
    console.log('Préfixe:', matricule);
    Alert.alert(
      "Opération réussi",
      "Le préfixe des matricule a été modifié avec succès",
      [{ text: "OK", style: "default" }]
    );

    setPrefixMatricule(matricule);
    router.push('/Admin_Menu');
  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
    <View className="flex-1 px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Paramètre de préfixe du matricule</Text>
        </View>
      
      <View className="m-0">

        <Text className="text-lg mb-2">Préfixe:</Text>
        <Pressable>
            <TextInput value={matricule} onChangeText={(value) => setMatricule(value)} placeholder="AMAA" className={`w-full h-12 border rounded-md p-3 mb-3 border-blue-500`} autoFocus
            />
        </Pressable>
        <View className="flex-row justify-center">
            <Button fontSize="" onPress={ () => onClick() } label="Enregistrer" className="mx-10" />
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Retour" className="mx-10" />
        </View>
      </View>

      {/* --- Clavier personnalisé --- */}
      <View className="pb-5 h-3/4">
        <ScrollView>
          <View className="flex-row flex-wrap justify-center m-0 p-0">
          </View>
        </ScrollView>
      </View>
    </View>
    </LinearGradient>
  );
}
