import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
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
    // { label: "Maso (Ophtalmologue)", route: "/ServiceMedical_DateDemande", icon: "eye", firstColor: "#cdd101ff", secondColor: "#766500" },
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

      {/* En-tête */}
      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          {medicalService}
        </Text>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#fff" }}>
          Hisoratra anarana
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      {/* Grille scrollable — uniquement les boutons principaux */}
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
        </View>
      </ScrollView>

      {/* Bouton retour — fixe en bas, séparé */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 18, stiffness: 120, delay: buttons.length * 80 }}
        style={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.08)",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push('/Menu')}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            borderRadius: 14,
            paddingVertical: 14,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <MaterialCommunityIcons name="keyboard-backspace" size={22} color="rgba(255,255,255,0.55)" />
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, fontWeight: "600" }}>
            Hiverina
          </Text>
        </TouchableOpacity>
      </MotiView>

    </LinearGradient>
  );
}
