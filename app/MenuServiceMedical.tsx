import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useRouter } from "expo-router";
import { MotiView } from "moti";
import { ScrollView, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

export default function MenuServiceMedical() {

  const router = useRouter();

  const { prefixMatricule, loggedUSer, bg1, bg2, medicalService } = useGlobal();
  
  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }

  console.log("loggedUSer:", loggedUSer);
  console.log("GLOBAL PREFIX MATRICULE:", prefixMatricule);
  console.log("GLOBAL SERVICE MEDICAL:", medicalService);  

  const buttons = [
    { label: "Dokotera", route: "/ServiceMedical_DateDemande", icon: "doctor", firstColor: "#1432BF", secondColor: "#01016E" },
    { label: "Maso (Ophtalmologue)", route: "/ServiceMedical_DateDemande", icon: "eye", firstColor:"#cdd101ff", secondColor:"#766500" },
    { label: "Fanabeazanaizana (PF)", route: "/ServiceMedical_DateDemande", icon: "human-male-female-child", firstColor:"#27b400ff", secondColor:"#005500" },
    { label: "Nify (Dentiste)", route: "/ServiceMedical_DateDemande", icon: "tooth", firstColor:"#9d00ffff", secondColor:"#4f1275ff" },
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
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
    <View className="flex-1 p-20">
      <View className="items-center justify-center">
        <Text className="text-3xl font-bold mb-8 fixed-top">Hisoratra anarana</Text>
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
            <SquareButton key={index} label={btn.label} onPress={() => onClick(btn.label, btn.route)} icon={btn.icon} firstColor={btn.firstColor} secondColor={btn.secondColor} />
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
            <SecondarySquareButton label="Hiverina" onPress={() => router.push('/Menu')} icon={"keyboard-backspace"} />
          </MotiView>
        </View>
        </ScrollView>
    </View>
    </LinearGradient>
  );
}
