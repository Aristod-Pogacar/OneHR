import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import DateSelector from "./components/DateSelector";

export default function Permission_StartingDate() {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  const router = useRouter();
  const { permissionMotif } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [valideValue, setValideValue] = useState<boolean>(true);

  const onChange = (startDate: Date) => {

    setSelectedDate(startDate);    
    if (today > startDate) {
      console.log("Invalid Date");
      setValideValue(false)
    } else {
      console.log("Valid Date");
      setValideValue(true)
    }

  }

  const clicked = (route: any, reason: any, startingDate: any) => {

    if(!valideValue) {
      Alert.alert(
        "Date invalide",
        "La date de fin ne peut pas être antérieure à la date d'aujourd'hui.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      router.push({
        pathname: route,
        params: { 
          permissionMotif: reason,
          startingDate: startingDate
        },
      });
    }

  }

  return (
    <View className="flex-1 bg-white px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Fangatahana fierana ({permissionMotif})</Text>
        </View>

      {/* --- Champs de saisie --- */}
      <View className="m-0">
        {/* <Text className="text-2xl font-bold mb-4">Demande de congé</Text> */}
        <View className="items-center justify-center mb-5">
          <Text className="text-2xl mb-2">Daty tsy hiasana</Text>
        </View>
        <DateSelector  onChange={(date) => onChange(date)} />
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
