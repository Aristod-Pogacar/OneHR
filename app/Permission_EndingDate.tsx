import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import DateSelector from "./components/DateSelector";

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

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

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

    if (!valideValue) {
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
    console.log("Starting date:", start);
    console.log("Ending date:", endDate);

    if (start >= endDate) {
      console.log("Invalid Date");
      setMessage("La date de fin ne peut pas être antérieure ou égale à la date de début.");
      setValideValue(false)
    } else if (calculerDifferenceEnJours(start, endDate) > Number.parseInt(maxDay.toString())) {
      console.log("Invalid Date");
      setMessage("La date de fin ne peut pas être plus de " + maxDay + " jours après la date de début.");
      setValideValue(false)
    } else {
      console.log("Valid Date");
      setValideValue(true)
    }
  }

  return (
    <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          {permissionMotif as string}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
          Daty hiverenena miasa
        </Text>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
          Maximum {maxDay} andro
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 28 }}>
        <DateSelector defaultValue={defaultDate} onChange={(date) => onChange(date)} />
        <View style={{ marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => onClick(permissionMotif, startingDate, endingDate)}
            activeOpacity={0.85} disabled={!valideValue}
            style={{
              backgroundColor: "#1432BF", borderRadius: 14, paddingVertical: 14, alignItems: "center",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
              shadowColor: "#1432BF", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
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
