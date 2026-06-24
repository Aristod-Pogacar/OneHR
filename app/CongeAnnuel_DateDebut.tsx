import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
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
    // if (today > startDate) {
    //   console.log("Invalid Date");
    //   setValideValue(false)
    // } else {
    //   console.log("Valid Date");
    //   setValideValue(true)
    // }

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
    <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Fangatahana Congé
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
          Daty tsy hiasana
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start", marginTop: 50, paddingHorizontal: 28 }}>
        <DateSelector onChange={(date) => onChange(date)} />
        <View style={{ marginTop: 50 }}>
          <TouchableOpacity
            onPress={() => clicked('/CongeAnnuel_DateFin', selectedDate)}
            activeOpacity={0.85}
            disabled={!valideValue}
            style={{
              backgroundColor: "#1432BF", borderRadius: 14,
              paddingVertical: 14, alignItems: "center",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
              shadowColor: "#1432BF", shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
              opacity: valideValue ? 1 : 0.4,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Manaraka →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()} activeOpacity={0.7}
            style={{ marginTop: 10, borderRadius: 14, paddingVertical: 12, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
          >
            <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>← Hiverina</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
