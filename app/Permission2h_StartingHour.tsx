import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import HourSelector from "./components/HourSelector";

export default function Permission2h_StartingHour() {
  const arrondirAuMultipleDe5 = (nombre: number) => Math.ceil(nombre / 5) * 5;
  const today = new Date();

  today.setSeconds(0);
  today.setMilliseconds(0);
  var minute = arrondirAuMultipleDe5(today.getMinutes());
  var hour = today.getHours()
  if (minute == 60) {
    minute = 0;
    hour++;
    today.setHours(today.getHours() + 1);
  }
  const router = useRouter();
  const [startingHour, setStartingHour] = useState<number>(hour);
  const [startingMinute, setStartingMinute] = useState<number>(minute);

  console.log("Hour:", startingHour);
  console.log("Minute:", startingMinute);

  const { bg1, bg2, loggedUSer } = useGlobal();

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  const onchange = (hour: number, minute: number) => {
    setStartingHour(hour);
    setStartingMinute(minute);
    console.log(hour.toString().padStart(2, "0").concat(":" + minute.toString().padStart(2, "0")))
  }

  const clicked = () => {
    console.log("Starting Hour:", startingHour);
    console.log("Starting Minute:", startingMinute);

    router.push({
      pathname: "/Permission2h_EndingHour",
      params: {
        startingHour: startingHour,
        startingMinute: startingMinute
      },
    });

  }

  return (
    <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Fangatahana fierana 2h
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
          Ora hivoahana
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start", marginTop: 50, paddingHorizontal: 28 }}>
        <HourSelector onChange={(hour, minute) => onchange(hour, minute)} defaultHour={hour} defaultMinute={minute} />
        <View style={{ marginTop: 50 }}>
          <TouchableOpacity
            onPress={clicked} activeOpacity={0.85}
            style={{
              backgroundColor: "#1432BF", borderRadius: 14, paddingVertical: 14, alignItems: "center",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
              shadowColor: "#1432BF", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
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
