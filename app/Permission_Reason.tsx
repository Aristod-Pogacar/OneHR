import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useRouter } from "expo-router";
import { MotiView } from "moti";
import { ScrollView, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

export default function PermissionReason() {

  const router = useRouter();
  const { bg1, bg2, loggedUSer } = useGlobal();

  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }


  const buttons = [
    { label: "Fanambadina", route: "/Permission_Reason_step2", icon: "ring", firstColor:"#ff62a9ff", secondColor:"#910050ff", maxDay: 3, child: [
      { label: "Ny mpiasa", route: "/Permission_StartingDate", icon: "ring", firstColor:"#27b400ff", secondColor:"#005500", maxDay: 3 },
      // { label: "Zanaka", route: "/Permission_StartingDate", icon: "ring", firstColor:"#e62e00ff", secondColor:"#771000", maxDay: 3 },
      { label: "Mpiraitampo", route: "/Permission_StartingDate", icon: "ring", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 1 },
    ] },
    { label: "Vodiondry", route: "/Permission_Reason_step2", icon: "heart-half-full", firstColor:"#cdd101ff", secondColor:"#766500", maxDay: 1, child: [
      { label: "Ny mpiasa", route: "/Permission_StartingDate", icon: "heart-half-full", firstColor:"#27b400ff", secondColor:"#005500", maxDay: 1 },
      { label: "Zanaka", route: "/Permission_StartingDate", icon: "heart-half-full", firstColor:"#e62e00ff", secondColor:"#771000", maxDay: 1 },
      { label: "Mpiraitampo", route: "/Permission_StartingDate", icon: "heart-half-full", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 1 },
    ] },
    { label: "Fahaterahan'ny zanaka", route: "/Permission_StartingDate", icon: "baby-face", firstColor:"#9d00ffff", secondColor:"#4f1275ff", maxDay: 2 },
    { label: "Famorana", route: "/Permission_StartingDate", icon: "content-cut", firstColor:"#b3b3b3ff", secondColor:"#555555ff", maxDay: 2 },
    { label: "Fahafatesana", route: "/Permission_Reason_step2", icon: "cross", firstColor:"#e62e00ff", secondColor:"#771000", maxDay: 3, child: [
      { label: "Vady", route: "/Permission_StartingDate", icon: "cross", firstColor:"#27b400ff", secondColor:"#005500", maxDay: 3 },
      { label: "Zanaka", route: "/Permission_StartingDate", icon: "cross", firstColor:"#e62e00ff", secondColor:"#771000", maxDay: 3 },
      { label: "Ray aman-dreny", route: "/Permission_StartingDate", icon: "cross", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 3 },
      { label: "Rafozana", route: "/Permission_StartingDate", icon: "cross", firstColor:"#cdd101ff", secondColor:"#766500", maxDay: 3 },
      { label: "Mpiraitampo", route: "/Permission_StartingDate", icon: "cross", firstColor:"#9d00ffff", secondColor:"#4f1275ff", maxDay: 3 },
    ] },
    { label: "Fidirana hopitaly", route: "/Permission_Reason_step2", icon: "hospital-box", firstColor:"#27b400ff", secondColor:"#005500", maxDay: 3, child: [
      { label: "Vady", route: "/Permission_StartingDate", icon: "hospital-box", firstColor:"#27b400ff", secondColor:"#005500", maxDay: 2 },
      { label: "Zanaka", route: "/Permission_StartingDate", icon: "hospital-box", firstColor:"#e62e00ff", secondColor:"#771000", maxDay: 2 },
      { label: "Ray aman-dreny", route: "/Permission_StartingDate", icon: "hospital-box", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 2 },
      { label: "Mpiraitampo", route: "/Permission_StartingDate", icon: "hospital-box", firstColor:"#cdd101ff", secondColor:"#766500", maxDay: 1 },
    ] },
    { label: "Famadihana", route: "/Permission_StartingDate", icon: "coffin", firstColor:"#ff9900ff", secondColor:"#86550bff", maxDay: 2 },
    { label: "Fifindra- monina", route: "/Permission_StartingDate", icon: "home-export-outline", firstColor: "#1432BF", secondColor: "#01016E", maxDay: 2 },
    { label: "Batemy/Kominio", route: "/Permission_StartingDate", icon: "church", firstColor:"#01c2edff", secondColor:"#026d85ff", maxDay: 1 },
    { label: "Tra-boina", route: "/Permission_StartingDate", icon: "fire", firstColor:"#8c5400ff", secondColor:"#432800ff", maxDay: 2 },
    { label: "Assistance maternelle", route: "/Permission_StartingDate", icon: "human-baby-changing-table", firstColor:"#a5e100ff", secondColor:"#537100ff", maxDay: 1 },
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
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
    <View className="flex-1 p-20">
      <View className="items-center justify-center">
        <Text className="text-3xl font-bold mb-8 fixed-top">Anton'ny fierana</Text>
        {/* <Text className="text-3xl font-bold mb-8 fixed-top">Safidy fototra</Text> */}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row flex-wrap justify-center">

          {buttons.map((btn, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: 600,
                delay: index * 100, // cascade
              }}
            >
            <SquareButton key={index} label={btn.label} onPress={() => clicked(btn.route as RelativePathString, btn.label, btn.maxDay, btn.child)} icon={btn.icon} firstColor={btn.firstColor} secondColor={btn.secondColor} />
            </MotiView>
          ))}
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 600,
              delay: buttons.length * 100,
            }}
          >
            <SecondarySquareButton label="Hiverina" onPress={() => router.back()} icon={"keyboard-backspace"} />
          </MotiView>
        </View>
        </ScrollView>
    </View>
    </LinearGradient>
  );
}
