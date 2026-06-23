import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
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
          onPress={() => router.back()}
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
