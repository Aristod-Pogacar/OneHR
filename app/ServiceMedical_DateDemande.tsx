import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import DateSelector from "./components/DateSelector";
import api from "./utils/axios";

type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

async function post(data: { employee: any; date: string; reason: string | string[]; }) {
  console.log("DATA:", data)
  await api.post('/smia-ostie/', data);
}

export default function ServiceMedical_DateDemande() {

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [valideValue, setValideValue] = useState<boolean>(true);

  const { reason } = useLocalSearchParams();

  const { bg1, bg2, loggedUSer, medicalService } = useGlobal();

  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }

  const onChange = (date: Date) => {

    setSelectedDate(date);    
    if (today > date) {
      console.log("Invalid Date");
      setValideValue(false)
    } else {
      console.log("Valid Date");
      setValideValue(true)
    }

  }

  const clicked = async (route: any, date: any) => {

    if(!valideValue) {
      Alert.alert(
        "Diso ny daty azafady",
        "Efa lasa ny daty nampidirinao tompoko ! Avereno azafady.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      const data = {
          "employee": loggedUSer.matricule,
          "date": date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0'),
          "reason": reason
      }
      console.log("DATA: ", data);
      await post(data).then((result) => {
        console.log("RESULTS: ", result);
        
        Alert.alert(
          "Fisoratana anarana ao amin'ny " + medicalService,
          "Voasoratra ao amin'ny " + medicalService + " ianao noho ny antony \"" + reason + "\" ny " + date.toLocaleDateString('mg-MG', options as DateTimeFormatOptions) + ".",
          [{ text: "OK", style: "default" }]
        );
        router.push({
          pathname: route,
        });
      }).catch((error) => {
        Alert.alert(
          "Erreur !",
          "Une erreur est survenue lors de la réservation.",
          [{ text: "OK", style: "default" }]
        );
        console.log(error);
      });
    }

  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
    <View className="flex-1 px-20 pt-4 justify-center">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">{medicalService}: {reason}</Text>
        </View>

      {/* --- Champs de saisie --- */}
      <View className="m-0">
        {/* <Text className="text-2xl font-bold mb-4">Demande de congé</Text> */}
        <View className="items-center justify-center mb-5">
          <Text className="text-2xl mb-2">Daty:</Text>
        </View>
        <DateSelector  onChange={(date) => onChange(date)} />
        <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={ () => clicked('/MenuServiceMedical', selectedDate) } label="OK" className="mx-10" />
              {/* <View className="p-10 m-10"></View> */}
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
            {/* <Button onPress={ () => console.log("OK") } label="OK" /> */}
        </View>
      </View>
    </View>
    </LinearGradient>
  );
}
