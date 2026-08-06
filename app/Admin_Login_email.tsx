import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGlobal } from './Providers/GlobalProvider';

export default function Login_matricule() {
  const { ipAddress, bg1, bg2 } = useGlobal();

  async function post(data: { login: string; }) {
    // const api = axios.create({
    //   baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
    //   timeout: 200000,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    const api = axios.create({
      baseURL: process.env.EXPO_PUBLIC_B_LEAVE_URL + "/", // change ici
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await api.post('/user/get-login-admin', data);
  }

  const black = "black";
  const blue = "blue";

  const router = useRouter();
  const [email, setEmail] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné

  const onPress = async () => {
    const data = {
      "login": "" + email
    }
    console.log("data:", data);
    await post(data).then(async (response) => {
      console.log("response:", response);
      if (response.status == 200 || response.status == 201) {
        router.push({
          pathname: '/Admin_Login_password',
          params: {
            userLogin: email
          },
        });
      }
    }).catch(async (error) => {
      console.log("error:", error.response.status);
      if (error.response.status === 401) {
        Alert.alert(
          "Diso ny email na ny matricule",
          "Tsy misy ao amin'ny angon-drakitra ny email na ny matricule \"" + email + "\" napetrakao tompoko!",
          [{ text: "OK", style: "default" }]
        );
      }
    })
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
        <View
          style={{
            width: 64, height: 64, borderRadius: 32,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
            alignItems: "center", justifyContent: "center", marginBottom: 8,
          }}
        >
          <MaterialCommunityIcons name="shield-lock-outline" size={30} color="#fff" />
        </View>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Administrateur
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Paramètre
        </Text>
        <View style={{ height: 1, marginTop: 16, width: "100%", backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      {/* Formulaire */}
      <View style={{ paddingHorizontal: 28, paddingTop: 32 }}>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
          Email / Matricule
        </Text>
        <Pressable onPress={() => setActiveField("start")}>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: activeField === "start" ? "rgba(100,140,255,0.6)" : "rgba(255,255,255,0.15)",
              borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4,
            }}
          >
            <TextInput
              value={email}
              placeholder="exemple@aquarabe.mg / AMAA000000"
              placeholderTextColor="rgba(255,255,255,0.25)"
              autoFocus
              onChangeText={(text) => setEmail(text)}
              style={{ color: "#fff", fontSize: 16, paddingVertical: 12 }}
            />
          </View>
        </Pressable>

        {/* Boutons */}
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          style={{
            marginTop: 16, backgroundColor: "#1432BF", borderRadius: 14,
            paddingVertical: 14, alignItems: "center",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
            shadowColor: "#1432BF", shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Manaraka →</Text>
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
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>← Hiverina</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
