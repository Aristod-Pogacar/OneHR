import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import DateSelector from "./components/DateSelector";

export default function CongeAnnuel_DateFin() {

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
  const { startingDate } = useLocalSearchParams();
  const [endingDate, setEndingDate] = useState<Date>(today);
  const [valideValue, setValideValue] = useState<Boolean>(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const voice = require("../assets/audios/Fin Tsy fiasana.wav");

  const startLoopSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        voice,
        {
          shouldPlay: true,
          isLooping: true,
          volume: 1.0,
        }
      );

      soundRef.current = sound;
    } catch (err) {
      console.log("Erreur audio:", err);
    }
  };

  const stopLoopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (e) {
      console.log("Son déjà arrêté");
    }
  };

  // 🎯 Démarre quand l'écran est actif / s'arrête quand on quitte
  useFocusEffect(
    useCallback(() => {
      startLoopSound();

      return () => {
        stopLoopSound(); // 🔥 stop auto quand on quitte l'écran
      };
    }, [])
  );

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

  const onClick = (startDate: any, endDate: any) => {
    const st = new Date(startDate)
    const en = new Date(endDate)
    const reste = calculerDifferenceEnJours(st, en);
    console.log('Différence:', reste);

    if (!valideValue) {
      Alert.alert(
        "Date invalide",
        "La date de fin ne peut pas être antérieure ou égale à la date de début.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      console.log(st);
      router.push({
        pathname: '/CongeAnnuel_Motif',
        params: {
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
    console.log("Starting date:", start);
    console.log("Ending date:", endDate);

    if (start >= endDate) {
      console.log("Invalid Date");
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
          <Text className="text-3xl font-bold">Fangatahana Congé</Text>
        </View>

        <View className="m-0">
          <View className="items-center justify-center mb-5">
            <Text className="text-2xl mb-2">Daty hiverenena miasa</Text>
          </View>

          <DateSelector onChange={(date) => onChange(date)} />
          <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={() => onClick(startingDate, endingDate)} label="OK" className="mx-10" disable={!valideValue} />
            <ButtonSecondary fontSize="" onPress={() => router.back()} label="Hiverina" className="mx-10" />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
