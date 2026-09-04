import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useFocusEffect, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useGlobal } from "./Providers/GlobalProvider";
import { SquareButton } from "./components/SquareButton";

export default function PermissionReason() {

  const router = useRouter();
  const { bg1, bg2, loggedUSer } = useGlobal();

  let currentSound: Audio.Sound | null = null;
  // let isPlaying = false;
  const [isPlaying, setIsPlaying] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopVoice(); // 🔇 dès qu'on quitte l'écran
      };
    }, [])
  );
  async function stopVoice() {
    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        currentSound = null;
        setIsPlaying(false);
      }
    } catch (e) {
      console.log("Stop audio error:", e);
    }
  }
  const [activeIndex, setActiveIndex] = useState(0);
  const [guided, setGuided] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<number | null>(null);

  const playVoice = async (file: any) => {
    // stoppe l'ancien son
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const { sound } = await Audio.Sound.createAsync(file);
    soundRef.current = sound;

    await sound.playAsync();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev + 1 < buttons.length ? prev + 1 : 0
      );
    }, 4000); // 5 secondes par bouton

    return () => clearInterval(interval);
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (!guided) return;

      let isActive = true;

      const startGuidedFlow = async () => {
        if (!isActive) return;

        await playVoice(buttons[activeIndex].voice);

        timerRef.current = setTimeout(() => {
          if (!isActive) return;

          setActiveIndex((prev) =>
            prev + 1 < buttons.length ? prev + 1 : 0
          );
        }, 4000);
      };

      startGuidedFlow();

      // 🔥 CLEANUP AUTOMATIQUE quand on quitte l’écran
      return () => {
        isActive = false;

        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        if (soundRef.current) {
          soundRef.current.stopAsync();
          soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      };
    }, [activeIndex, guided])
  );
  const stoppingRef = useRef(false);

  const stopGuided = async () => {
    if (stoppingRef.current) return;

    stoppingRef.current = true;

    try {
      setGuided(false);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const sound = soundRef.current;

      if (sound) {
        soundRef.current = null;

        await sound.stopAsync();
        await sound.unloadAsync();
      }
    } finally {
      stoppingRef.current = false;
    }
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;
    // playVoice(buttons[activeIndex].voice);
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


  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  const buttons = [
    { label: "Banky GAB", route: "/Permission2h_StartingHour", icon: "account-cash", firstColor: "#27b400ff", secondColor: "#005500", voice: require("../assets/audios/Banque.wav") },
    // { label: "Banky birao", route: "/Permission2h_StartingHour", icon: "bank", firstColor: "#ff9900ff", secondColor: "#86550bff" },
    { label: "vavahady", route: "/Permission2h_StartingHour", icon: "gate", firstColor: "#1432BF", secondColor: "#01016E", voice: require("../assets/audios/Vavahady.wav") },
    { label: "Ambohimena", route: "/Permission2h_StartingHour", icon: "map-marker-radius", firstColor: "#01c2edff", secondColor: "#026d85ff", voice: require("../assets/audios/Ambohimena.wav") },
    { label: "Any an-trano", route: "/Permission2h_StartingHour", icon: "home", firstColor: "#8c5400ff", secondColor: "#432800ff", voice: require("../assets/audios/Ho any an-trano.wav") },
    // { label: "Cotona", route: "/Permission2h_StartingHour", icon: "factory", firstColor: "#a5e100ff", secondColor: "#537100ff", voice: require("../assets/audios/Cotona.wav") },
    { label: "Ecole", route: "/Permission2h_StartingHour", icon: "school", firstColor: "#ff9900ff", secondColor: "#86550bff", voice: require("../assets/audios/Ecole.wav") },
    { label: "Fokontany", route: "/Permission2h_StartingHour", icon: "city", firstColor: "#cdd101ff", secondColor: "#766500", voice: require("../assets/audios/Fokontany.wav") },
    { label: "Police", route: "/Permission2h_StartingHour", icon: "police-badge", firstColor: "#9d00ffff", secondColor: "#4f1275ff", voice: require("../assets/audios/Police.wav") },
    { label: "SMIA Nord", route: "/Permission2h_StartingHour", icon: "medical-bag", firstColor: "#e62e00ff", secondColor: "#771000", voice: require("../assets/audios/SMIA Avaratra.wav") },
    { label: "Handevina", route: "/Permission2h_StartingHour", icon: "coffin", firstColor: "#b3b3b3ff", secondColor: "#555555ff", voice: require("../assets/audios/Handevina.wav") },
    { label: "Colis", route: "/Permission2h_StartingHour", icon: "package", firstColor: "#ff62a9ff", secondColor: "#910050ff", voice: require("../assets/audios/Colis.wav") },
    { label: "Commune", route: "/Permission2h_StartingHour", icon: "city", firstColor: "#a5e100ff", secondColor: "#537100ff", voice: require("../assets/audios/Commune.wav") },
    { label: "Hafa", route: "/Permission2h_StartingHour", icon: "map-marker-question", firstColor: "#00e174ff", secondColor: "#115a37ff", voice: require("../assets/audios/Hafa.wav") },
  ];

  const clicked = (route: RelativePathString, reason: string) => {
    router.push({
      pathname: route,
      params: {
        reason: reason
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
          Anton'ny fierana adiny 2
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
                onPress={() => clicked(btn.route as RelativePathString, btn.label)}
                icon={btn.icon}
                firstColor={btn.firstColor}
                secondColor={btn.secondColor}
                blink={index === activeIndex}
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
