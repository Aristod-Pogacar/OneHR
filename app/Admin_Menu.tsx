import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
import { BackHandler, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useGlobal } from "./Providers/GlobalProvider";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

export default function MenuScreen() {

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;
    const handleBackPress = () => {
      Toast.show({
        text1: 'Fampahafantarana',
        text2: 'Raha hivoaka dia kitiho ny "Hivoaka"',
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

  const { prefixMatricule, medicalService, setLoggedUser, bg1, bg2 } = useGlobal();

  console.log("GLOBAL PREFIX MATRICULE:", prefixMatricule);
  console.log("GLOBAL SERVICE MEDICAL:", medicalService);

  const buttons = [
    { label: "Préfix Matricule", route: "/Setting_matricule", icon: "alpha-m", firstColor: "#1432BF", secondColor: "#01016E" },
    // { label: "Permission 2h", route: "/Permission2h_StartingHour", icon: "clock-time-three", firstColor: "#A8A711", secondColor: "#766500" },
    { label: "Service Médicale", route: "/Setting_Service_Medical", icon: "hospital-box", firstColor: "#219900", secondColor: "#005500" },
    { label: "Enroll Fingerprint", route: "/EnrollScreen", icon: "fingerprint", firstColor: "#cdd101ff", secondColor: "#766500" },
    { label: "Delete Fingerprint", route: "/Delete_fingerprint", icon: "fingerprint-off", firstColor: "#A92300", secondColor: "#771000" },
  ];

  // Corrige aussi le logout (même bug qu'avant)
  const logout = () => {
    setLoggedUser(null);
    // Le useEffect gère la navigation si besoin,
    // sinon push direct ici car c'est un admin screen sans guard loggedUSer
    router.replace('/Login_fingerprint');
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
      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Administrateur
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Paramètre
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      {/* Grille */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          {buttons.map((btn, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 40, scale: 0.92 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 120, delay: index * 80 }}
            >
              <SquareButton
                label={btn.label}
                onPress={() => router.push(btn.route as RelativePathString)}
                icon={btn.icon}
                firstColor={btn.firstColor}
                secondColor={btn.secondColor}
              />
            </MotiView>
          ))}
          <MotiView
            from={{ opacity: 0, translateY: 40, scale: 0.92 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: "spring", damping: 18, stiffness: 120, delay: buttons.length * 80 }}
          >
            <SecondarySquareButton label="Hivoaka" onPress={logout} icon="logout" />
          </MotiView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
