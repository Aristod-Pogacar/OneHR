import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useGlobal } from "./Providers/GlobalProvider";
import { LoadingModal } from "./components/LoadingModal";
import { SecondarySquareButton } from "./components/SecondarySquareButton";
import { SquareButton } from "./components/SquareButton";
import api from "./utils/axios";

async function puppeteerGoToLeave(sessionId: string): Promise<any> {
  try {
    const path = '/bot/' + sessionId + '/leave';
    const response = await api.post(path);

    return response.data; // 👍 toujours un return
  } catch (error) {
    console.log("ERROR:", error);
    return null; // 👍 ne retourne jamais undefined
  }
}

export default function MenuScreen() {
  const [loading, setLoading] = useState(false);

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
  // async function playVoice(soundFile: any) {
  //   try {
  //     // Empêche les appels multiples
  //     if (isPlaying) return;

  //     setIsPlaying(true);

  //     // Nettoie l'ancien son si existant
  //     if (currentSound) {
  //       await currentSound.stopAsync().catch(() => { });
  //       await currentSound.unloadAsync().catch(() => { });
  //       currentSound = null;
  //     }

  //     const { sound } = await Audio.Sound.createAsync(
  //       soundFile,
  //       { shouldPlay: false }
  //     );

  //     currentSound = sound;

  //     await sound.playAsync();

  //     sound.setOnPlaybackStatusUpdate((status) => {
  //       if (!status.isLoaded) return;

  //       if (status.didJustFinish) {
  //         sound.unloadAsync().catch(() => { });
  //         currentSound = null;
  //         setIsPlaying(false);
  //       }
  //     });

  //   } catch (error) {
  //     console.log("Audio error:", error);
  //     setIsPlaying(false);
  //   }
  // }
  const [activeIndex, setActiveIndex] = useState(0);
  const [guided, setGuided] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<number | null>(null);
  // const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  // useEffect(() => {
  //   if (!guided) return;

  //   playVoice(buttons[activeIndex].voice);
  //   const timer = setTimeout(() => {
  //     setActiveIndex((prev) =>
  //       prev + 1 < buttons.length ? prev + 1 : 0
  //     );
  //   }, 4000);

  //   return () => clearTimeout(timer);
  // }, [activeIndex, guided]);

  // const stopVoice = () => {
  //   if (currentSound) {
  //     currentSound.unloadAsync().catch(() => { });
  //     currentSound = null;
  //     isPlaying = false;
  //   }
  // }
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

  const router = useRouter();

  const { prefixMatricule, loggedUSer, setLoggedUser, bg1, bg2, medicalService, puppeteerSession } = useGlobal();

  useEffect(() => {
    if (loggedUSer === null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  console.log("loggedUSer:", loggedUSer);
  console.log("GLOBAL PREFIX MATRICULE:", prefixMatricule);
  console.log("GLOBAL SERVICE MEDICAL:", medicalService);

  const buttons = [
    { label: "Tsy fiasana (congé)", route: "/MenuConge", icon: "calendar-remove", firstColor: "#1432BF", secondColor: "#01016E", voice: require("../assets/audios/menu-conge.wav"), typeButton: "Leave" },
    { label: "Permission 2h", route: "/Permission2h_StartingHour", icon: "clock-time-three", firstColor: "#cdd101ff", secondColor: "#766500", voice: require("../assets/audios/menu-permission_2h.wav"), typeButton: "" },
    { label: medicalService, route: "/MenuServiceMedical", icon: "hospital-box", firstColor: "#27b400ff", secondColor: "#005500", voice: require("../assets/audios/menu-smia.wav"), typeButton: "" },
    // { label: "Menu 2", route: "", icon: "home" },
    // { label: "TEST", route: "/test", icon: "bug-check", firstColor:"#A92300", secondColor: "#771000" },
  ];

  const logout = async () => {
    await stopVoice();
    await stopGuided();
    router.push('/');
    setLoggedUser(null);
  }

  const click = async (route: string, typeButton: string) => {
    setLoading(true);
    await stopVoice();
    // if (typeButton === "Leave") {
    //   await puppeteerGoToLeave(puppeteerSession).then((value: any) => {
    //     console.log("GO TO LEAVE:", JSON.stringify(value));
    //     if (value?.success) {
    //       setLoading(false);
    //       router.push(route as RelativePathString);
    //     } else {
    //       setLoading(false);
    //       Alert.alert(
    //         "Erreur",
    //         "Une erreur est survenue. L'application va se fermer.",
    //         [{ text: "OK", onPress: () => BackHandler.exitApp() }],
    //         { cancelable: false }
    //       );
    //     }
    //   });
    // } else {
    setLoading(false);
    router.push(route as RelativePathString);
    // }
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
          <Text className="text-3xl font-bold mb-8 fixed-top">Bonjour {loggedUSer?.fullname} !</Text>
          {/* <Text className="text-3xl font-bold mb-8 fixed-top">Safidy fototra</Text> */}
        </View>
        <LoadingModal
          visible={loading}
          // message="An-dala-mpiakarakarana ny fangatahanao tompoko. Mahadrasa kely..."
          message="Loading..."
        />

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
                {/* aCl$vis$2026$ */}
                <SquareButton key={index} label={btn.label} onPress={async () => click(btn.route, btn.typeButton)} icon={btn.icon} firstColor={btn.firstColor} secondColor={btn.secondColor} blink={index === activeIndex} />
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
              <SecondarySquareButton label="Hiala" onPress={async () => await logout()} icon={"logout"} />
            </MotiView>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
