import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import { KeyboardButton } from "./components/KeyboardButton";

export default function CongeAnnuel_DateFin() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné

  const buttons = [
    "1","2","3","4",
    "5","6","7","8",
    "9","0","/","FAFAINA",
  ];

  // ✅ Ajout d’un chiffre ou suppression
  const handleKeyPress = (label: string) => {
    if (label === "FAFAINA") {
      if (activeField === "start") setStartDate(startDate.slice(0, -1));
      else setEndDate(endDate.slice(0, -1));
    } else {
      if (activeField === "start") setStartDate(startDate + label);
      else setEndDate(endDate + label);
    }
  };

  return (
    <View className="flex-1 bg-white px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Hangataka fialan-tsasatra isan-taona</Text>
        </View>
      
      {/* --- Champs de saisie --- */}
      <View className="m-0">
        {/* <Text className="text-2xl font-bold mb-4">Demande de congé</Text> */}

        <Text className="text-lg mb-2">Fiafarany</Text>
        <Pressable onPress={() => setActiveField("start")}>
            <TextInput
                value={startDate}
                placeholder="JJ/MM/AAAA"
                editable={false}
                className={`w-full h-12 border rounded-md p-3 mb-3 bg-gray-100 ${activeField === "start" ? "border-blue-500" : "border-gray-300"}`}
            />
        </Pressable>
        <View className="flex-row justify-center">
            <Button fontSize="" onPress={ () => router.push('/CongeAnnuel_Motif') } label="OK" className="mx-10" />
              {/* <View className="p-10 m-10"></View> */}
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
            {/* <Button onPress={ () => console.log("OK") } label="OK" /> */}
        </View>
      </View>

      {/* --- Clavier personnalisé --- */}
      <View className="border-t border-y border-r border-l border-gray-300 pb-5">
        <ScrollView>
          <View className="flex-row flex-wrap justify-center m-0 p-0">
            {buttons.map((label, index) => (
              <KeyboardButton
                key={index}
                label={label}
                onPress={() => handleKeyPress(label)} />
            ))}
          </View>
        </ScrollView>
      </View>
      {/* <View className="justify-center">
        <ScrollView className="flex-row flex-wrap justify-center">

          </ScrollView>
      </View> */}
    </View>
  );
}
