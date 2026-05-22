import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

export default function MenuServiceMedical() {

  const router = useRouter();

  const { prefixMatricule, loggedUSer, bg1, bg2, medicalService } = useGlobal();
  // ✅ CORRECT
  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  console.log("loggedUSer:", loggedUSer);
  console.log("GLOBAL PREFIX MATRICULE:", prefixMatricule);
  console.log("GLOBAL SERVICE MEDICAL:", medicalService);

  const buttons = [
    { label: "Dokotera", route: "/ServiceMedical_DateDemande", icon: "doctor", firstColor: "#1432BF", secondColor: "#01016E" },
    { label: "Maso (Ophtalmologue)", route: "/ServiceMedical_DateDemande", icon: "eye", firstColor: "#cdd101ff", secondColor: "#766500" },
    { label: "Fanabeazanaizana (PF)", route: "/ServiceMedical_DateDemande", icon: "human-male-female-child", firstColor: "#27b400ff", secondColor: "#005500" },
    { label: "Nify (Dentiste)", route: "/ServiceMedical_DateDemande", icon: "tooth", firstColor: "#9d00ffff", secondColor: "#4f1275ff" },
    // { label: "Menu 2", route: "/ServiceMedical_DateDemande", icon: "home" },
    // { label: "TEST", route: "/test", icon: "bug-check", firstColor:"#A92300", secondColor: "#771000" },
  ];

  const onClick = (label: string, route: string) => {
    console.log("Label:", label);
    console.log("Route:", route);
    router.push({
      pathname: route as RelativePathString,
      params: {
        reason: label
      }
    });
  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      style={{ flex: 1 }}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          {medicalService}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Hisoratra anarana
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

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
                onPress={() => onClick(btn.label, btn.route)}
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
            <SecondarySquareButton label="Hiverina" onPress={() => router.push('/Menu')} icon="keyboard-backspace" />
          </MotiView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
