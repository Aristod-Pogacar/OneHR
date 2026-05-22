import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";

export default function Login_password() {
  const { ipAddress, bg1, bg2 } = useGlobal();

  const { userLogin } = useLocalSearchParams();
  console.log("userLogin:", userLogin);

  async function compare(data: any): Promise<any> {
    try {
      const api = axios.create({
        baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
        timeout: 200000,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const path = '/user/connect-admin-user';
      const response = await api.post(path, {
        email: data.userLogin,
        password: data.password
      });

      return response.data; // 👍 toujours un return
    } catch (error) {
      console.log("Compare error:", error);
      return null; // 👍 ne retourne jamais undefined
    }
  }
  const router = useRouter();
  const [password, setPassword] = useState(""); // stocke la date de début (texte)

  const onPress = () => {
    compare({ userLogin, password }).then(value => {
      if (value) {
        console.log("stringify:", JSON.stringify(value));
        router.push({
          pathname: '/Admin_Menu',
          params: {
            user: JSON.stringify(value)
          },
        });
      } else {
        Alert.alert(
          "Diso ny reny miafina",
          "Tsy misy ny reny miafina tompoko!",
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
          <MaterialCommunityIcons name="lock-outline" size={30} color="#fff" />
        </View>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Administrateur
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Mot de passe
        </Text>

        {/* Badge login */}
        <View
          style={{
            marginTop: 16, flexDirection: "row", alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.07)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.13)",
            borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, gap: 10,
          }}
        >
          <MaterialCommunityIcons name="account-circle-outline" size={20} color="rgba(255,255,255,0.5)" />
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{userLogin}</Text>
        </View>

        <View style={{ height: 1, marginTop: 16, width: "100%", backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      {/* Formulaire */}
      <View style={{ paddingHorizontal: 28, paddingTop: 32 }}>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
          Mot de passe
        </Text>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderWidth: 1, borderColor: "rgba(100,140,255,0.5)",
            borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4,
          }}
        >
          <TextInput
            value={password}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.25)"
            autoFocus
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={{ color: "#fff", fontSize: 16, paddingVertical: 12 }}
          />
        </View>

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
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Hiditra →</Text>
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
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>← Hiverina</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
