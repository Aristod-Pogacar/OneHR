import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { RadioGroup } from "./components/RadioGroup";

export default function Setting_Service_Medical() {
  const router = useRouter();
  const { bg1, bg2, medicalService, setMedicalService, ipAddress } = useGlobal();
  const [results, setResults] = useState<string[]>([]);
  const [serviceMedical, setServiceMedical] = useState(medicalService);

  async function get() {
    var rest: string[] = [];
    const api = axios.create({
      baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    await api.get('/medical-service').then(value => {
      value.data.map((item: any) => rest.push(item.name))
    });
    return rest;
  }

  // ✅ useEffect au lieu d'appel direct dans le corps
  useEffect(() => {
    get().then(value => setResults(value));
  }, []);

  const onClick = () => {
    setMedicalService(serviceMedical);
    Alert.alert(
      "Opération réussie",
      "Le service médical a été modifié avec succès",
      [{ text: "OK", onPress: () => router.push('/Admin_Menu') }]
    );
  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      style={{ flex: 1 }}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />

      {/* En-tête */}
      <View style={{ paddingTop: 48, paddingHorizontal: 28, alignItems: "center" }}>
        <View style={{
          width: 64, height: 64, borderRadius: 32,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
          alignItems: "center", justifyContent: "center", marginBottom: 8,
        }}>
          <MaterialCommunityIcons name="hospital-box-outline" size={30} color="#fff" />
        </View>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Paramètre
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Service médical
        </Text>

        {/* Badge service actuel */}
        <View style={{
          marginTop: 12, flexDirection: "row", alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.07)",
          borderWidth: 1, borderColor: "rgba(255,255,255,0.13)",
          borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
        }}>
          <MaterialCommunityIcons name="hospital-marker" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginLeft: 8 }}>
            Actuel : <Text style={{ color: "#fff", fontWeight: "700" }}>{medicalService}</Text>
          </Text>
        </View>

        <View style={{ height: 1, marginTop: 16, width: "100%", backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      {/* Contenu scrollable */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 24, paddingBottom: 32 }}>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
          Choisissez le service médical
        </Text>

        {/* RadioGroup dans un conteneur glassmorphism */}
        <View style={{
          backgroundColor: "rgba(255,255,255,0.07)",
          borderWidth: 1, borderColor: "rgba(255,255,255,0.13)",
          borderRadius: 16, padding: 8, marginBottom: 24,
        }}>
          <RadioGroup
            options={results}
            onValueChange={(value) => setServiceMedical(value)}
            initialValue={medicalService}
          />
        </View>

        <TouchableOpacity
          onPress={onClick}
          activeOpacity={0.85}
          style={{
            backgroundColor: "#1432BF", borderRadius: 14,
            paddingVertical: 14, alignItems: "center",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
            shadowColor: "#1432BF", shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Enregistrer ✓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            marginTop: 10, borderRadius: 14, paddingVertical: 12, alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>← Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}