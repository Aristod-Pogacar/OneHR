import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { ScrollView, Text, View } from "react-native";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

export default function MenuConge() {
  const router = useRouter();

  const buttons = [
    { label: "Fialan- tsasatra isan-taona", route: "/CongeAnnuel_DateDebut", icon: "beach-access" },
    { label: "Fierana", route: "", icon: "alarm" },
    { label: "Fierana 2h", route: "", icon: "hourglass-bottom" },
  ];

  return (
    <LinearGradient
      colors={["#DEEFFF", "#C3EFFF"]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
    <View className="flex-1 p-20">
      <View className="items-center justify-center">
        <Text className="text-3xl font-bold mb-8 fixed-top">Fialan-tsasatra</Text>
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
            <SquareButton key={index} label={btn.label} onPress={() => router.push(btn.route)} icon={btn.icon} />
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
            <SecondarySquareButton label="Hiverina" onPress={() => router.back()} icon={"arrow-back"} />
            </MotiView>
        </View>
        </ScrollView>
    </View>
    </LinearGradient>
  );
}
