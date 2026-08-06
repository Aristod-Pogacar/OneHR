import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import DateSelector from "./components/DateSelector";
import { LoadingModal } from "./components/LoadingModal";

type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

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
  const [loading, setLoading] = useState(false);

  const { reason } = useLocalSearchParams();

  const { bg1, bg2, loggedUSer, medicalService, ipAddress } = useGlobal();

  async function post(data: { employee: any; date: string; reason: string | string[]; }) {
    const api = axios.create({
      baseURL: process.env.EXPO_PUBLIC_B_LEAVE_URL + "/", // change ici
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("DATA:", data)
    await api.post('/smia-ostie/', data);
  }

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

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
    setLoading(true);

    if (!valideValue) {
      setLoading(false);
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
        setLoading(false);
        Alert.alert(
          "Fisoratana anarana ao amin'ny " + medicalService,
          "Voasoratra ao amin'ny " + medicalService + " ianao noho ny antony \"" + reason + "\" ny " + date.toLocaleDateString('mg-MG', options as DateTimeFormatOptions) + ".",
          [{ text: "OK", style: "default" }]
        );
        router.push({
          pathname: route,
        });
      }).catch((error) => {
        setLoading(false);
        Alert.alert(
          "Erreur !",
          "Tsy tontosa ny fangatahanao, mamerena azafady.",
          [{ text: "OK", style: "default" }]
        );
        console.log(error);
      });
    }

  }

  return (
    <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
      <LoadingModal visible={loading} message="Loading..." />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          {medicalService}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
          {reason as string}
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start", paddingTop: 20, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
          Daty fangatahana
        </Text>
        <DateSelector onChange={(date) => onChange(date)} />
        <View style={{ marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => clicked('/MenuServiceMedical', selectedDate)}
            activeOpacity={0.85} disabled={!valideValue}
            style={{
              backgroundColor: "#1432BF", borderRadius: 14, paddingVertical: 14, alignItems: "center",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
              shadowColor: "#1432BF", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
              opacity: valideValue ? 1 : 0.4,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Hampankatoavina ✓</Text>
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
