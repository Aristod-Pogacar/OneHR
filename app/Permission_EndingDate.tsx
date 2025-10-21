import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import DateSelector from "./components/DateSelector";

export default function Permission_EndingDate() {
  const today = new Date();
  const router = useRouter();
  const { permissionMotif, startingDate } = useLocalSearchParams();
  const [endingDate, setEndingDate] = useState<Date | null>(today);
  const [valideValue, setValideValue] = useState<Boolean>(true);

  const onClick = (reason: any, startDate: any, endDate: any) => {
    const st = new Date(startDate)
    console.log("Reason:", reason);
    console.log("Starting date:", st);
    console.log("Ending date:", endDate);
    if(!valideValue) {
      Alert.alert(
        "Date invalide",
        "La date de fin ne peut pas être antérieure à la date de début.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      Alert.alert(
        "Permission accordée",
        "Motif: " + permissionMotif +
        "\nDébut: " + st +
        "\nFin: " + endingDate,
        [{ text: "OK", style: "default" }]
      );
    }
  }

  const onChange = (endDate: Date) => {
    const start = new Date(startingDate); // 🔥 conversion ici
    // setEndingDate(end);
    setEndingDate(endDate);
    console.log("Starting date:",start);
    console.log("Ending date:",endDate);
    
    if (start > endDate) {
      console.log("Invalid Date");
      setValideValue(false)
    } else {
      console.log("Valid Date");
      setValideValue(true)
    }
  }

  return (
    <View className="flex-1 bg-white px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Fierana ({permissionMotif})</Text>
        </View>

      {/* --- Champs de saisie --- */}
      <View className="m-0">
        {/* <Text className="text-2xl font-bold mb-4">Demande de congé</Text> */}

        <Text className="text-lg mb-2">Fiafarany</Text>
        <DateSelector  onChange={(date) => onChange(date)} />
        {/* <DateSelector  onChange={(date) => setEndingDate(date)} /> */}
        <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={ () => onClick(permissionMotif, startingDate, endingDate) } label="OK" className="mx-10" disable={!valideValue} />
              {/* <View className="p-10 m-10"></View> */}
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
            {/* <Button onPress={ () => console.log("OK") } label="OK" /> */}
        </View>
      </View>
    </View>
  );
}
