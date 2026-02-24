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
  ];

  const logout = () => {
    router.push('/');
    setLoggedUser(null);
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
        <Text className="text-3xl font-bold mb-8 fixed-top">Paramètre</Text>
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
            <SquareButton key={index} label={btn.label} onPress={() => router.push(btn.route as RelativePathString)} icon={btn.icon} firstColor={btn.firstColor} secondColor={btn.secondColor} />
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
            <SecondarySquareButton label="Hivoaka" onPress={() => logout()} icon={"logout"} />
          </MotiView>
        </View>
        </ScrollView>
    </View>
    </LinearGradient>
  );
}
