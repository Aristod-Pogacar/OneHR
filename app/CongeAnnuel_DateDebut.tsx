import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import DateSelector from "./components/DateSelector";

export default function CongeAnnuel() {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [valideValue, setValideValue] = useState<boolean>(true);
  const soundRef = useRef<Audio.Sound | null>(null);

  const voice = require("../assets/audios/Début Tsy fiasana.wav");

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

  const clicked = (route: any, startingDate: any) => {

    if (!valideValue) {
      Alert.alert(
        "Date invalide",
        "La date de fin ne peut pas être antérieure à la date d'aujourd'hui.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      router.push({
        pathname: route,
        params: {
          startingDate: startingDate
        },
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
          <Text className="text-3xl font-bold">Fangatahana Congé</Text>
        </View>

        {/* --- Champs de saisie --- */}
        <View className="m-0">
          {/* <Text className="text-2xl font-bold mb-4">Demande de congé</Text> */}
          <View className="items-center justify-center mb-5">
            <Text className="text-2xl mb-2">Daty tsy hiasana</Text>
          </View>
          <DateSelector onChange={(date) => onChange(date)} />
          <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={() => clicked('/CongeAnnuel_DateFin', selectedDate)} label="OK" className="mx-10" />
            {/* <View className="p-10 m-10"></View> */}
            <ButtonSecondary fontSize="" onPress={() => router.back()} label="Hiverina" className="mx-10" />
            {/* <Button onPress={ () => console.log("OK") } label="OK" /> */}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
