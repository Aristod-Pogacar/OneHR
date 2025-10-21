import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { ScrollView, Text, View } from "react-native";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

export default function PermissionReason() {
  const router = useRouter();

  const buttons = [
    { label: "Fanambadina", route: "/Permission_StartingDate", icon: "ring" },
    { label: "Vodiondry", route: "/Permission_StartingDate", icon: "heart-half-full" },
    { label: "Fahaterahana", route: "/Permission_StartingDate", icon: "baby-face" },
    { label: "Famorana", route: "/Permission_StartingDate", icon: "content-cut" },
    { label: "Fahafatesana", route: "/Permission_StartingDate", icon: "cross" },
    { label: "Fidirana hopitaly", route: "/Permission_StartingDate", icon: "hospital-box" },
    { label: "Famadihana", route: "/Permission_StartingDate", icon: "coffin" },
    { label: "Fifindra- monina", route: "/Permission_StartingDate", icon: "home-export-outline" },
    { label: "Batemy", route: "/Permission_StartingDate", icon: "church" },
    { label: "Tra-boina", route: "/Permission_StartingDate", icon: "fire" },
    { label: "Assistance maternelle", route: "/Permission_StartingDate", icon: "human-baby-changing-table" },
  ];

  const clicked = (route: any, reason: any) => {
    router.push({
      pathname: route,
      params: { permissionMotif: reason },
    });
  }

  return (
    <LinearGradient
      colors={["#DEEFFF", "#C3EFFF"]}
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
            <SquareButton key={index} label={btn.label} onPress={() => clicked(btn.route, btn.label)} icon={btn.icon} />
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
