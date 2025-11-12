import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import HourSelector from "./components/HourSelector";

export default function Permission2h_EndingHour() {
  const today = new Date();
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  const router = useRouter();
  const { startingHour, startingMinute } = useLocalSearchParams();
  const [endingHour, setEndingHour] = useState<number>(today.getHours());
  const [endingMinute, setEndingMinute] = useState<number>(today.getMinutes());
  const [valideValue, setValideValue] = useState<boolean>(true);
  const [error, setError] = useState("");

  const getTimeDiff = (startingHour: number, startingMinute: number, endingHour: number, endingMinutes: number) => {
    const startingTotalMinutes = (startingHour * 60) + startingMinute;
    const endingTotalMinutes = (endingHour * 60) + endingMinutes;
    let differenceInMinutes = endingTotalMinutes - startingTotalMinutes;
    if (differenceInMinutes < 0) {
        differenceInMinutes += (24 * 60); // 1440 minutes dans une journée
    }
    return differenceInMinutes;
}
  const onChange = (hour: number, minute: number) => {

    setEndingHour(hour);
    setEndingMinute(minute);

    let startingTime = startingHour.toString().padStart(2, "0") + ":" + startingMinute.toString().padStart(2, "0");
    let endingTime = endingHour.toString().padStart(2, "0") + ":" + endingMinute.toString().padStart(2, "0");

    const diff = getTimeDiff(Number.parseInt(startingHour.toString()), Number.parseInt(startingMinute.toString()), endingHour, endingMinute)
    console.log("Diff=", diff);
    

    if (startingTime > endingTime) {
      console.log("Invalid Time");
      setValideValue(false)
      setError("L'heure d'arrivé ne peut pas être antérieure à l'heure de départ.")
    } else if(diff > 120) {
      console.log("Invalid Time");
      setValideValue(false)
      setError("L'heure d'arrivé doit être au plus tard 2h après l'heure de départ.")
    } else {
      console.log("Valid Date");
      setValideValue(true)
    }

  }

  const clicked = () => {

    if(!valideValue) {
      Alert.alert(
        "Heure invalide",
        error,
        [{ text: "OK", style: "default" }]
      );
    } else {
      Alert.alert(
        "Permission 2h",
        "Demande de permission 2h accordée !",
        [{ text: "OK", style: "default" }]
      );
      // router.push({
      //   pathname: "",
      //   params: { 
      //     startingHour: startingHour,
      //     startingMinute: startingMinute,
      //     endingHour: endingHour,
      //     endingMinute: endingMinute,
      //   },
      // });
    }

  }

  return (
    <View className="flex-1 bg-white px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Fangatahana fierana 2h</Text>
        </View>

      <View className="m-0">
        <View className="items-center justify-center mb-5">
          <Text className="text-2xl mb-2">Ora hiverenana</Text>
        </View>
        <HourSelector onChange={ (hour, minute) => onChange(hour, minute) } />
        <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={ () => clicked() } label="OK" className="mx-10" />
            {/* <Button fontSize="" onPress={ () => clicked('/Permission_EndingDate', permissionMotif, selectedDate) } label="OK" className="mx-10" /> */}
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
        </View>
      </View>
    </View>
  );
}
