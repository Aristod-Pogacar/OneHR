import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Pressable, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useGlobal } from './Providers/GlobalProvider';
import { KeyboardButton } from "./components/KeyboardButton";
import { LoadingModal } from "./components/LoadingModal";

export default function Login_matricule() {
  const { prefixMatricule, bg1, bg2, ipAddress } = useGlobal();

  async function get(employee: string) {
    var results
    const path = '/employee/' + employee
    console.log("path:", path);
    const api = axios.create({
      baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    await api.get(path).then(value => { results = value.data });

    return results
  }

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;
    const handleBackPress = () => {
      Toast.show({
        text1: 'Information',
        text2: 'Tsy afaka miverina intsony ianao tompoko.',
      });
      return true;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => {
      backHandlerSubscription.remove();
    };
  }, [isFocused]);

  const router = useRouter();
  const [matricule, setMatricule] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné
  const [loading, setLoading] = useState(false);

  const buttons = [
    "1", "2", "3", "4",
    "5", "6", "7", "8",
    "9", "0",
  ];

  // ✅ Ajout d’un chiffre ou suppression
  const handleKeyPress = (label: string) => {
    if (label === "FAFAINA") {
      if (activeField === "start") setMatricule(matricule.slice(0, -1));
      else setEndDate(endDate.slice(0, -1));
    } else {
      if (activeField === "start") setMatricule(matricule + label);
      else setEndDate(endDate + label);
    }
  };

  const onPress = () => {
    setLoading(true);
    get("" + prefixMatricule + matricule).then(user => {
      if (user) {
        // puppeteerLogin(puppeteerSession).then(value => {
        // console.log("stringify:", JSON.stringify(value));
        // setPuppeteerSession(value.sessionId);
        // if (value.success == true) {
        setLoading(false);
        console.log("stringify:", JSON.stringify(user));
        router.push({
          pathname: '/Login_password',
          params: {
            user: JSON.stringify(user)
          },
        });
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
        setLoading(false);
        Alert.alert(
          "Diso ny matricule",
          "Tsy misy ny matricule " + matricule + " tompoko!",
          [{ text: "OK", style: "default" }]
        );

      }
    })
  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      style={{ flex: 1 }}   // ← jamais className sur LinearGradient sous Android
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      <View className="flex-1 justify-between">
        {/* <View className="flex-1 fl"> */}
        <LoadingModal visible={loading} message="Loading..." />

        {/* En-tête */}
        <View className="items-center pt-14 gap-2">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-1"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}
          >
            <MaterialCommunityIcons name="card-account-details-outline" size={30} color="#fff" />
          </View>
          <Text className="text-lg font-extrabold text-white">
            Ampidiro ny matricule
          </Text>
          <Text className="text-xs text-white/45 tracking-wide">
            Fenoy ny laharanao
          </Text>
        </View>

        {/* Champ matricule */}
        <View className="px-6">
          <Text className="text-xs text-white/50 uppercase tracking-widest mb-2">
            Matricule
          </Text>
          <Pressable onPress={() => setActiveField("start")}>
            <View
              className="rounded-2xl px-4 py-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                borderColor: activeField === "start" ? "rgba(100,140,255,0.6)" : "rgba(255,255,255,0.15)",
              }}
            >
              <Text className="text-white text-2xl" style={{ letterSpacing: 6 }}>
                {prefixMatricule}{matricule}
              </Text>
            </View>
          </Pressable>

          {/* Bouton OK */}
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
            <Text className="text-white font-bold text-base tracking-wide">
              Manaraka →
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/Login_fingerprint')}
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
          className="pt-0 pb-3 px-2"
          style={{ backgroundColor: "rgba(0,0,0,0)", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0)" }}
        >
          <View className="flex-row flex-wrap justify-center gap-2">
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
