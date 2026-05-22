import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { KeyboardButton } from "./components/KeyboardButton";
import { LoadingModal } from "./components/LoadingModal";

export default function Login_password() {
  const router = useRouter();
  const [password, setPassword] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné
  const { user } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const { setLoggedUser, bg1, bg2, ipAddress } = useGlobal();
  async function compare(data: any): Promise<any> {
    try {
      const api = axios.create({
        baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
        timeout: 200000,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const path = '/employee/compare';
      const response = await api.post(path, {
        matricule: data.matricule,
        password: data.password
      });

      return response.data; // 👍 toujours un return
    } catch (error) {
      console.log("Compare error:", error);
      return null; // 👍 ne retourne jamais undefined
    }
  }

  const jsonUser = JSON.parse(user.toString())

  const buttons = [
    "1", "2", "3", "4",
    "5", "6", "7", "8",
    "9", "0",
  ];

  // ✅ Ajout d’un chiffre ou suppression
  const handleKeyPress = (label: string) => {
    if (label === "FAFAINA") {
      if (activeField === "start") setPassword(password.slice(0, -1));
      else setEndDate(endDate.slice(0, -1));
    } else {
      if (activeField === "start") setPassword(password + label);
      else setEndDate(endDate + label);
    }
  };

  const onPress = async () => {
    setLoading(true);
    const test = await compare({
      matricule: jsonUser.matricule,
      password: password
    })
    console.log("test:", test);

    if (!test) {
      setLoading(false);
      Alert.alert(
        "Erreur !",
        "Mangataka anao mba hamerina tompoko",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    // if (password === jsonUser.appPassword) {
    if (test.isEmployee) {
      // puppeteerLogin(puppeteerSession, {
      //   matricule: jsonUser.matricule,
      //   password: jsonUser.password
      // }).then(value => {
      // console.log("stringify:", JSON.stringify(value));
      // if (value.success == true) {
      console.log('PASSWORD:', jsonUser.password);

      setLoggedUser(jsonUser)

      router.push({
        pathname: '/Menu',
        params: {
          user: JSON.stringify(jsonUser)
        },
      });
      setLoading(false);
      // } else {
      //   setLoading(false);
      //   Alert.alert(
      //     "Erreur",
      //     "Iangaviana ianao mba ho any amin'ny biraon'ny RH",
      //     [{ text: "OK", style: "default" }]
      //   );
      // }
      // })
    } else {
      Alert.alert(
        "Diso ny teny miafina",
        "Diso ny teny miafina! Mamerena mampiditra azafady",
        [{ text: "OK", style: "default" }]
      );
      setLoading(false);
    }
    // router.push({
    //   pathname: '/Login_password',
    //   params: { 
    //     user: JSON.stringify(value)
    //   },
    // });
  }

  // Extraire les initiales du nom complet
  const initials = jsonUser.fullname
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      style={{ flex: 1 }}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <LoadingModal visible={loading} message="Loading..." />

        {/* En-tête */}
        <View style={{ alignItems: "center", paddingTop: 52, paddingBottom: 8, gap: 8 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <MaterialCommunityIcons name="lock-outline" size={30} color="#fff" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#fff" }}>
            Teny miafina
          </Text>
          <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            Ampidiro ny code miafina
          </Text>
        </View>

        {/* Badge utilisateur */}
        <View
          style={{
            marginHorizontal: 24,
            marginBottom: 4,
            backgroundColor: "rgba(255,255,255,0.07)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.13)",
            borderRadius: 14,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#1432BF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{initials}</Text>
          </View>
          <View>
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
              {jsonUser.name + ' ' + jsonUser.firstname}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
              Employé · #{jsonUser.matricule}
            </Text>
          </View>
        </View>

        {/* Champ mot de passe */}
        <View style={{ paddingHorizontal: 24 }}>
          <Text
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Teny miafina
          </Text>
          <Pressable onPress={() => setActiveField("start")}>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                borderColor: "rgba(100,140,255,0.5)",
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 16,
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                shadowColor: "#3a5cff",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
              }}
            >
              {password.split("").map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "rgba(255,255,255,0.9)",
                  }}
                />
              ))}
              {password.length === 0 && (
                <Text style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
                  ••••••
                </Text>
              )}
            </View>
          </Pressable>

          {/* Boutons */}
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={{
              marginTop: 14,
              backgroundColor: "#1432BF",
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
              shadowColor: "#1432BF",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15, letterSpacing: 0.5 }}>
              Hiditra →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              marginTop: 10,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              paddingVertical: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
              ← Hiverina
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clavier */}
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0)",
            paddingTop: 12,
            paddingBottom: 20,
            paddingHorizontal: 8,
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {buttons.map((label, index) => (
              <KeyboardButton key={index} label={label} onPress={() => handleKeyPress(label)} />
            ))}
            <KeyboardButton backgroundColor="bg-transparent" textColor="text-transparent" label="" disabled onPress={() => { }} />
            <KeyboardButton backgroundColor="bg-red-600" textColor="text-white" label="FAFAINA ⌫" onPress={() => handleKeyPress("FAFAINA")} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
