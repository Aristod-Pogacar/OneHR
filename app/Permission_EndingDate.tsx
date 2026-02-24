import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import DateSelector from "./components/DateSelector";
import api from "./utils/axios";

async function post(data: { matricule: string; start_date: string; end_date: string; comment: any; leave_type: string; }) {
  await api.post('/leave/', data);
}

export default function Permission_EndingDate() {

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
  const { permissionMotif, startingDate, maxDay } = useLocalSearchParams();
  
  const defaultDate = new Date(startingDate.toString());
  defaultDate.setDate(defaultDate.getDate() + Number.parseInt(maxDay.toString()))
  console.log('====================================');
  console.log("Default date:", defaultDate);
  console.log('====================================');
  // defaultDate.set
  const [endingDate, setEndingDate] = useState<Date>(defaultDate);
  const [valideValue, setValideValue] = useState<Boolean>(true);
  const [message, setMessage] = useState<string>("");
  
  const { bg1, bg2, loggedUSer } = useGlobal();

  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }

  function calculerDifferenceEnJours(date1: Date, date2: Date) {
    const MS_PAR_JOUR = 1000 * 60 * 60 * 24;

    const differenceEnMs = date2.getTime() - date1.getTime();
    return Math.floor(Math.abs(differenceEnMs / MS_PAR_JOUR));
  }

  const onClick = (reason: any, startDate: any, endDate: any) => {
    const st = new Date(startDate)
    const en = new Date(endDate)
    const reste = calculerDifferenceEnJours(st, en);
    console.log('Différence:', reste);
    
    if(!valideValue) {
      Alert.alert(
        "Date invalide",
        message,
        [{ text: "OK", style: "default" }]
      );
    } else {
      console.log(st);
      router.push({
        pathname: '/Permission_ConfirmData',
        params: { 
          permissionMotif: reason,
          startingDate: startDate,
          endingDate: endDate
        },
      });
      
      // Alert.alert(
      //   "Demande de permission",
      //   "Motif: " + reason +
      //   "\nDate: " + st.toLocaleDateString('mg-MG', options) +
      //   "\nRetour au travail: " + endingDate.toLocaleDateString('mg-MG', options) +
      //   "\nNombre de jour d'absence: " + reste,
      //   [{ text: "OK", style: "default" }]
      // );
    }
  }

  const onChange = (endDate: Date) => {
    const start = new Date(startingDate.toString());
    setEndingDate(endDate);
    console.log("Starting date:",start);
    console.log("Ending date:",endDate);
    
    if (start >= endDate ) {
      console.log("Invalid Date");
      setMessage("La date de fin ne peut pas être antérieure ou égale à la date de début.");
      setValideValue(false)
    } else if (calculerDifferenceEnJours(start, endDate) > Number.parseInt(maxDay.toString()) ) {
      console.log("Invalid Date");
      setMessage("La date de fin ne peut pas être plus de " + maxDay + " jours après la date de début.");
      setValideValue(false)
    } else {
      console.log("Valid Date");
      setValideValue(true)
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
            <Text className="text-3xl font-bold">Fangatahana fierana ({permissionMotif})</Text>
        </View>

      <View className="m-0">
        <View className="items-center justify-center mb-5">
          <Text className="text-2xl mb-2">Daty hiverenena miasa</Text>
        </View>

        <DateSelector defaultValue={defaultDate} onChange={(date) => onChange(date)} />
        <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={ () => onClick(permissionMotif, startingDate, endingDate) } label="OK" className="mx-10" disable={!valideValue} />
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
        </View>
      </View>
    </View>
    </LinearGradient>
  );
}
