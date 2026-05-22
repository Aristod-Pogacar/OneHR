import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";

export default function CongeAnnuel_DateFin() {
  const router = useRouter();

  const { startingDate, endingDate } = useLocalSearchParams();

  const { loggedUSer, bg1, bg2 } = useGlobal();

  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }

  const [remark, setRemark] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné

  const onClick = () => {
    router.push({
      pathname: '/CongeAnnuel_ConfirmData',
      params: {
        remark: remark,
        startingDate: startingDate,
        endingDate: endingDate
      },
    });
  }

  return (
    <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Fangatahana Congé
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
          Fanamarihana
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start", marginTop: 20, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
          Fanamarihana
        </Text>
        <View style={{
          backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1,
          borderColor: "rgba(100,140,255,0.5)", borderRadius: 14,
          paddingHorizontal: 16, paddingVertical: 4, marginBottom: 24,
        }}>
          <TextInput
            value={remark}
            onChangeText={(value) => setRemark(value)}
            placeholder="Fanamarihana momba ny fangatahana"
            placeholderTextColor="rgba(255,255,255,0.25)"
            autoFocus
            style={{ color: "#fff", fontSize: 16, paddingVertical: 12 }}
          />
        </View>

        <TouchableOpacity
          onPress={onClick} activeOpacity={0.85}
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
    </LinearGradient>
  );
}
