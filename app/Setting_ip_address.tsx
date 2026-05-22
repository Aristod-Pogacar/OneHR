import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";

export default function Setting_ip_address() {
  const router = useRouter();
  const { ipAddress, setIpAddress, bg1, bg2 } = useGlobal();
  const [ip, setIp] = useState(ipAddress);

  const onClick = () => {
    setIpAddress(ip);
    Alert.alert(
      "Opération réussie",
      "L'adresse IP a été modifiée avec succès",
      [{ text: "OK", onPress: () => router.replace('/Login_fingerprint') }]
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
          <MaterialCommunityIcons name="card-account-details-outline" size={30} color="#fff" />
        </View>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Paramètre
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Adresse IP
        </Text>
        <View style={{ height: 1, marginTop: 16, width: "100%", backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      {/* Formulaire */}
      <View style={{ paddingHorizontal: 28, paddingTop: 32 }}>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
          Adresse IP actuelle
        </Text>

        {/* Badge valeur actuelle */}
        <View style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.07)",
          borderWidth: 1, borderColor: "rgba(255,255,255,0.13)",
          borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
          marginBottom: 16,
        }}>
          <MaterialCommunityIcons name="tag-outline" size={18} color="rgba(255,255,255,0.4)" />
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginLeft: 8 }}>
            Valeur actuelle : <Text style={{ color: "#fff", fontWeight: "700" }}>{ipAddress}</Text>
          </Text>
        </View>

        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
          Nouvelle adresse IP
        </Text>
        <View style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          borderWidth: 1, borderColor: "rgba(100,140,255,0.5)",
          borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4,
          marginBottom: 24,
        }}>
          <TextInput
            value={ip}
            onChangeText={(value) => setIp(value)}
            placeholder="ex: AMAA"
            placeholderTextColor="rgba(255,255,255,0.25)"
            autoFocus
            style={{ color: "#fff", fontSize: 20, paddingVertical: 12, fontWeight: "700", letterSpacing: 3 }}
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
          onPress={() => router.replace('/Login_fingerprint')}
          activeOpacity={0.7}
          style={{
            marginTop: 10, borderRadius: 14, paddingVertical: 12, alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>← Retour</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}