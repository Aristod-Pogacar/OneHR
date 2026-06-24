import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useGlobal } from "./Providers/GlobalProvider";
import { LoadingModal } from "./components/LoadingModal";
import { SquareButton } from "./components/SquareButton";

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

  const router = useRouter();

  const { prefixMatricule, loggedUSer, setLoggedUser, bg1, bg2, medicalService, puppeteerSession } = useGlobal();

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_fingerprint');
    }
  }, [loggedUSer]);

  const buttons = [
    { label: "Tsy fiasana (congé)", route: "/MenuConge", icon: "calendar-remove", firstColor: "#1432BF", secondColor: "#01016E", voice: require("../assets/audios/menu-conge.wav"), typeButton: "Leave" },
    { label: "Permission 2h", route: "/Permission2h_StartingHour", icon: "clock-time-three", firstColor: "#cdd101ff", secondColor: "#766500", voice: require("../assets/audios/menu-permission_2h.wav"), typeButton: "" },
    { label: medicalService, route: "/MenuServiceMedical", icon: "hospital-box", firstColor: "#27b400ff", secondColor: "#005500", voice: require("../assets/audios/menu-smia.wav"), typeButton: "" },
    // { label: "Menu 2", route: "", icon: "home" },
    // { label: "TEST", route: "/test", icon: "bug-check", firstColor:"#A92300", secondColor: "#771000" },
  ];

  const logout = async () => {
    await stopGuidance();
    await stopVoice();
    await stopGuided();
    // router.push('/');
    setLoggedUser(null);
  }
  const stopGuidance = async () => {

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
  const click = async (route: string, typeButton: string) => {
    setLoading(true);
    await stopVoice();
    setLoading(false);
    router.push(route as RelativePathString);
  }
  return (
    <LinearGradient
      colors={[bg1, bg2]}
      style={{ flex: 1 }}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      {/* Overlay subtil pour la profondeur */}
      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.15)",
        }}
      />

      <LoadingModal visible={loading} message="Loading..." />

      {/* En-tête */}
      <View style={{ paddingTop: 60, paddingHorizontal: 28, paddingBottom: 0 }}>
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          Tongasoa
        </Text>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: "#fff",
            textShadowColor: "rgba(100,140,255,0.4)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 12,
          }}
        >
          Bonjour, {loggedUSer?.name + ' ' + loggedUSer?.firstname} !
        </Text>

        {/* Séparateur lumineux */}
        <View
          style={{
            height: 1,
            marginTop: 20,
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        />
      </View>

      {/* Grille de boutons */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            // gap: 12,
          }}
        >
          {buttons.map((btn, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 40, scale: 0.92 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{
                type: "spring",
                damping: 18,
                stiffness: 120,
                delay: index * 80,
              }}
            >
              <SquareButton
                label={btn.label}
                onPress={() => click(btn.route, btn.typeButton)}
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
          onPress={async () => await logout()}
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
          <MaterialCommunityIcons name="logout" size={22} color="rgba(255,255,255,0.55)" />
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, fontWeight: "600" }}>
            Hivoaka
          </Text>
        </TouchableOpacity>
      </MotiView>
    </LinearGradient>
  );
  // return (
  //   <LinearGradient
  //     colors={[bg1, bg2]}
  //     className="flex-1"
  //     start={{ x: 0.5, y: 0 }}
  //     end={{ x: 0.8, y: 0.8 }}
  //   >
  //     <View className="flex-1 p-20">
  //       <View className="items-center justify-center">
  //         <Text className="text-3xl font-bold mb-8 fixed-top">Bonjour {loggedUSer?.fullname} !</Text>
  //         {/* <Text className="text-3xl font-bold mb-8 fixed-top">Safidy fototra</Text> */}
  //       </View>
  //       <LoadingModal
  //         visible={loading}
  //         // message="An-dala-mpiakarakarana ny fangatahanao tompoko. Mahadrasa kely..."
  //         message="Loading..."
  //       />

  //       <ScrollView contentContainerStyle={{ padding: 16 }}>
  //         <View className="flex-row flex-wrap justify-center">

  //           {buttons.map((btn, index) => (
  //             <MotiView
  //               key={index}
  //               from={{ opacity: 0, translateY: 50 }}
  //               animate={{ opacity: 1, translateY: 0 }}
  //               transition={{
  //                 type: "timing",
  //                 duration: 600,
  //                 delay: index * 100, // cascade
  //               }}
  //             >
  //               {/* aCl$vis$2026$ */}
  //               <SquareButton key={index} label={btn.label} onPress={async () => click(btn.route, btn.typeButton)} icon={btn.icon} firstColor={btn.firstColor} secondColor={btn.secondColor} blink={index === activeIndex} />
  //             </MotiView>
  //           ))}
  //           <MotiView
  //             from={{ opacity: 0, translateY: 50 }}
  //             animate={{ opacity: 1, translateY: 0 }}
  //             transition={{
  //               type: "timing",
  //               duration: 600,
  //               delay: buttons.length * 100,
  //             }}
  //           >
  //             <SecondarySquareButton label="Hiala" onPress={async () => await logout()} icon={"logout"} />
  //           </MotiView>
  //         </View>
  //       </ScrollView>
  //     </View>
  //   </LinearGradient>
  // );
}
