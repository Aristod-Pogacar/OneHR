import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useFocusEffect, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";

export default function MenuConge() {
  const { bg1, bg2, loggedUSer } = useGlobal();
  const router = useRouter();

  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }

  const buttons = [
    { label: "Congé annuel", route: "/CongeAnnuel_DateDebut", icon: "plane-car", firstColor: "#cdd101ff", secondColor: "#766500", voice: require("../assets/audios/Congé annuel.wav") },
    { label: "Permission", route: "/Permission_Reason", icon: "calendar-remove", firstColor: "#27b400ff", secondColor: "#005500", voice: require("../assets/audios/Permission.wav") },
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
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
      <View className="flex-1 p-20">
        <View className="items-center justify-center">
          <Text className="text-3xl font-bold mb-8 fixed-top">Fangatahana tsy fiasana</Text>
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
                <SquareButton key={index} label={btn.label} onPress={async () => { await stopVoice(); router.push(btn.route as RelativePathString) }} icon={btn.icon} firstColor={btn.firstColor} secondColor={btn.secondColor} blink={index === activeIndex} />
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
