import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

export default function PermissionReason() {

  const router = useRouter();
  const { bg1, bg2, loggedUSer } = useGlobal();

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  const buttons = [
    {
      label: "Fanambadina", route: "/Permission_Reason_step2", icon: "ring", firstColor: "#ff62a9ff", secondColor: "#910050ff", maxDay: 3, child: [
        { label: "Ny mpiasa", route: "/Permission_StartingDate", icon: "ring", firstColor: "#27b400ff", secondColor: "#005500", maxDay: 3 },
        // { label: "Zanaka", route: "/Permission_StartingDate", icon: "ring", firstColor:"#e62e00ff", secondColor:"#771000", maxDay: 3 },
        { label: "Mpiraitampo", route: "/Permission_StartingDate", icon: "ring", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 1 },
      ]
    },
    {
      label: "Vodiondry", route: "/Permission_Reason_step2", icon: "heart-half-full", firstColor: "#cdd101ff", secondColor: "#766500", maxDay: 1, child: [
        { label: "Ny mpiasa", route: "/Permission_StartingDate", icon: "heart-half-full", firstColor: "#27b400ff", secondColor: "#005500", maxDay: 1 },
        { label: "Zanaka", route: "/Permission_StartingDate", icon: "heart-half-full", firstColor: "#e62e00ff", secondColor: "#771000", maxDay: 1 },
        { label: "Mpiraitampo", route: "/Permission_StartingDate", icon: "heart-half-full", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 1 },
      ]
    },
    { label: "Fahaterahan'ny zanaka", route: "/Permission_StartingDate", icon: "baby-face", firstColor: "#9d00ffff", secondColor: "#4f1275ff", maxDay: 2 },
    { label: "Famorana", route: "/Permission_StartingDate", icon: "content-cut", firstColor: "#b3b3b3ff", secondColor: "#555555ff", maxDay: 2 },
    {
      label: "Fahafatesana", route: "/Permission_Reason_step2", icon: "cross", firstColor: "#e62e00ff", secondColor: "#771000", maxDay: 3, child: [
        { label: "Vady", route: "/Permission_StartingDate", icon: "cross", firstColor: "#27b400ff", secondColor: "#005500", maxDay: 3 },
        { label: "Zanaka", route: "/Permission_StartingDate", icon: "cross", firstColor: "#e62e00ff", secondColor: "#771000", maxDay: 3 },
        { label: "Ray aman-dreny", route: "/Permission_StartingDate", icon: "cross", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 3 },
        { label: "Rafozana", route: "/Permission_StartingDate", icon: "cross", firstColor: "#cdd101ff", secondColor: "#766500", maxDay: 3 },
        { label: "Mpiraitampo", route: "/Permission_StartingDate", icon: "cross", firstColor: "#9d00ffff", secondColor: "#4f1275ff", maxDay: 3 },
      ]
    },
    {
      label: "Fidirana hopitaly", route: "/Permission_Reason_step2", icon: "hospital-box", firstColor: "#27b400ff", secondColor: "#005500", maxDay: 3, child: [
        { label: "Vady", route: "/Permission_StartingDate", icon: "hospital-box", firstColor: "#27b400ff", secondColor: "#005500", maxDay: 2 },
        { label: "Zanaka", route: "/Permission_StartingDate", icon: "hospital-box", firstColor: "#e62e00ff", secondColor: "#771000", maxDay: 2 },
        { label: "Ray aman-dreny", route: "/Permission_StartingDate", icon: "hospital-box", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 2 },
        { label: "Mpiraitampo", route: "/Permission_StartingDate", icon: "hospital-box", firstColor: "#cdd101ff", secondColor: "#766500", maxDay: 1 },
      ]
    },
    { label: "Famadihana", route: "/Permission_StartingDate", icon: "coffin", firstColor: "#ff9900ff", secondColor: "#86550bff", maxDay: 2 },
    { label: "Fifindra- monina", route: "/Permission_StartingDate", icon: "home-export-outline", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 2 },
    { label: "Batemy/Kominio", route: "/Permission_StartingDate", icon: "church", firstColor: "#01c2edff", secondColor: "#026d85ff", maxDay: 1 },
    { label: "Tra-boina", route: "/Permission_StartingDate", icon: "fire", firstColor: "#8c5400ff", secondColor: "#432800ff", maxDay: 2 },
    { label: "Assistance maternelle", route: "/Permission_StartingDate", icon: "human-baby-changing-table", firstColor: "#a5e100ff", secondColor: "#537100ff", maxDay: 1 },
  ];

  const clicked = (route: RelativePathString, reason: string, maxDay: number, child: any) => {
    router.push({
      pathname: route,
      params: {
        permissionMotif: reason,
        maxDay: maxDay,
        child: JSON.stringify(child)
      },
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
          Permission
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Anton'ny fierana
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
                onPress={() => clicked(btn.route as RelativePathString, btn.label, btn.maxDay, btn.child)}
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
            <SecondarySquareButton label="Hiverina" onPress={() => router.back()} icon="keyboard-backspace" />
          </MotiView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
