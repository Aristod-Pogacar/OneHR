import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { ScrollView, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

interface ButtonData {
  label: string;
  route: string;
  icon: string;
  firstColor: string;
  secondColor: string;
  maxDay: number;
  child?: undefined;
}


export default function PermissionReason() {

  const router = useRouter();
  const { permissionMotif, child } = useLocalSearchParams();
  const { bg1, bg2, loggedUSer } = useGlobal();

  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }

  const children = JSON.parse(child as string);
  console.log('====================================');
  console.log(children);
  console.log('====================================');
  console.log('====================================');
  console.log(permissionMotif);
  console.log('====================================');

  const buttons = children

  const clicked = (route: RelativePathString, reason: string, maxDay: number) => {
    router.push({
      pathname: route,
      params: {
        permissionMotif: permissionMotif + " " + reason,
        maxDay: maxDay
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

            {buttons.map((btn: ButtonData, index: number) => (
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
                <SquareButton key={index} label={btn.label} onPress={() => clicked(btn.route as RelativePathString, btn.label, btn.maxDay)} icon={btn.icon} firstColor={btn.firstColor} secondColor={btn.secondColor} />
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
