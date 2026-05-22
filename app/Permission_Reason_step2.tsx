import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
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

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

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
      style={{ flex: 1 }}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          {permissionMotif as string}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Anton'ny fierana
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          {buttons.map((btn: ButtonData, index: number) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 40, scale: 0.92 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 120, delay: index * 80 }}
            >
              <SquareButton
                label={btn.label}
                onPress={() => clicked(btn.route as RelativePathString, btn.label, btn.maxDay)}
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
