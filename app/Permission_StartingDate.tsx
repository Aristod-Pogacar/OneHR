import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import DateSelector from "./components/DateSelector";

export default function Permission_StartingDate() {
  const today = new Date();
  const router = useRouter();
  const { permissionMotif } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const clicked = (route: any, reason: any, startingDate: any) => {
    console.log("Reason:", reason);
    console.log("Starting date:", startingDate);
    
    router.push({
      pathname: route,
      params: { 
        permissionMotif: reason,
        startingDate: startingDate
      },
    });
  }

  return (
    <View className="flex-1 bg-white px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Fierana ({permissionMotif})</Text>
        </View>

      {/* --- Champs de saisie --- */}
      <View className="m-0">
        {/* <Text className="text-2xl font-bold mb-4">Demande de congé</Text> */}

        <Text className="text-lg mb-2">Fanombohany</Text>
        <DateSelector  onChange={(date) => setSelectedDate(date)} />
        <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={ () => clicked('/Permission_EndingDate', permissionMotif, selectedDate) } label="OK" className="mx-10" />
              {/* <View className="p-10 m-10"></View> */}
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
            {/* <Button onPress={ () => console.log("OK") } label="OK" /> */}
        </View>
      </View>
    </View>
  );
}
