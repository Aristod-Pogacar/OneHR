import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useFocusEffect, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { SquareButton } from "./components/SquareButton";

export default function MenuConge() {
  const { bg1, bg2, loggedUSer } = useGlobal();
  const router = useRouter();

  // ✅ CORRECT
  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  const buttons = [
    { label: "Congé annuel", route: "/CongeAnnuel_DateDebut", icon: "plane-car", firstColor: "#cdd101ff", secondColor: "#766500", voice: require("../assets/audios/Congé annuel.wav") },
    { label: "Permission", route: "/Permission_Reason", icon: "calendar-remove", firstColor: "#27b400ff", secondColor: "#005500", voice: require("../assets/audios/Permission.wav") },
    { label: "Historique", route: "/Historique", icon: "history", firstColor: "#e62e00ff", secondColor: "#771000", voice: require("../assets/audios/Permission.wav") },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [guided, setGuided] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<number | null>(null);
  // const timerRef = useRef<NodeJS.Timeout | null>(null);
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
  const stopGuided = async () => {
    setGuided(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

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
          Fangatahana
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Tsy fiasana
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
                onPress={async () => { await stopVoice(); router.push(btn.route as RelativePathString); }}
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
          onPress={() => router.push('/Menu')}
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
