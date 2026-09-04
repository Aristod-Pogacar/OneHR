import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { ErrorModal } from "./components/ErrorModal";
import { LoadingModal } from "./components/LoadingModal";
import api from "./utils/axios";

type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

export default function Permission_ConfirmData() {
  const today = new Date();
  const router = useRouter();
  const { reason, startingHour, startingMinute, endingHour, endingMinute } = useLocalSearchParams();
  const { loggedUSer, ipAddress, bg1, bg2, connected } = useGlobal();
  const [loading, setLoading] = useState(false);

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  async function post(data: {
    reason?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    expectedStartTime: string;
    expectedEndTime: string;
    employee: string;
  }) {
    return await api.post('/permission2h/', data);
  }

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  const onClick = async () => {
    setLoading(true);
    try {
      const permissionData = {
        reason: "" + reason,
        date: "" + today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0"),
        startTime: String(startingHour).padStart(2, "0") + ":" + String(startingMinute).padStart(2, "0"),
        endTime: String(endingHour).padStart(2, "0") + ":" + String(endingMinute).padStart(2, "0"),
        expectedStartTime: String(startingHour).padStart(2, "0") + ":" + String(startingMinute).padStart(2, "0"),
        expectedEndTime: String(endingHour).padStart(2, "0") + ":" + String(endingMinute).padStart(2, "0"),
        employee: loggedUSer.matricule
      };
      await post(permissionData).then(async (permission2h) => {
        console.log("PERMISSION 2H:", permission2h);
        // setPermissionID(permission2h.data.id)
        const date = new Date(permission2h.data.date)
        setLoading(false);
        Alert.alert(
          "Permission 2h",
          "Demande de permission 2h accordée !",
          [{ text: "OK", style: "default" }]
        );
        router.push("/Menu");
      })
    } catch (error: any) {
      Alert.alert(
        "Tsy voaray ny fangatahana",
        "Tsy voaray ny fangatahana tompoko. Avereno azafady",
        [{ text: "OK", style: "default" }]
      );
      setLoading(false);
    }

  }

  return (
    <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
      <ErrorModal visible={!connected} message="Misy olana ny fifandraisana tompoko !" onClose={() => { }} />
      <LoadingModal visible={loading} message="Loading..." />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Fangatahana fierana
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
          Fanamarinana
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start", marginTop: 20, paddingHorizontal: 28 }}>
        {/* Carte récapitulatif */}
        <View style={{
          backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1,
          borderColor: "rgba(255,255,255,0.13)", borderRadius: 16,
          padding: 20, marginBottom: 24,
        }}>
          {[
            { label: "Antony", value: reason },
            { label: "Daty", value: today.toLocaleDateString('mg-MG', options as DateTimeFormatOptions) },
            { label: "Ora hiaingana", value: `${startingHour}:${startingMinute}` },
            { label: "Ora hiverenana", value: `${endingHour}:${endingMinute}` },
          ].map((item, i) => (
            <View key={i} style={{ marginBottom: i < 3 ? 14 : 0 }}>
              <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 15, color: "#fff", fontWeight: "600" }}>
                {item.value as string}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={onClick} activeOpacity={0.85}
          style={{
            backgroundColor: "#1432BF", borderRadius: 14, paddingVertical: 14, alignItems: "center",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
            shadowColor: "#1432BF", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
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
    </LinearGradient>
  );
}
