import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useGlobal } from './Providers/GlobalProvider';
import { Button } from "./components/Button";
import { KeyboardButton } from "./components/KeyboardButton";
import { LoadingModal } from "./components/LoadingModal";
import api from "./utils/axios";

async function get(employee: string) {
  var results
  const path = '/employee/' + employee
  console.log("path:", path);

  await api.get(path).then(value => { results = value.data });

  return results
}

async function puppeteerLogin(sessionID: string): Promise<any> {
  try {
    const path = '/bot' + sessionID + '/login';
    const response = await api.post(path);

    return response.data; // 👍 toujours un return
  } catch (error) {
    console.log("Compare error:", error);
    return null; // 👍 ne retourne jamais undefined
  }
}

export default function Login_matricule() {
  const { prefixMatricule, bg1, bg2, setPuppeteerSession, puppeteerSession } = useGlobal();

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;
    const handleBackPress = () => {
      Toast.show({
        text1: 'Information',
        text2: 'Tsy afaka miverina intsony ianao tompoko.',
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
  const [matricule, setMatricule] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné
  const [loading, setLoading] = useState(false);

  const buttons = [
    "1", "2", "3", "4",
    "5", "6", "7", "8",
    "9", "0",
  ];

  // ✅ Ajout d’un chiffre ou suppression
  const handleKeyPress = (label: string) => {
    if (label === "FAFAINA") {
      if (activeField === "start") setMatricule(matricule.slice(0, -1));
      else setEndDate(endDate.slice(0, -1));
    } else {
      if (activeField === "start") setMatricule(matricule + label);
      else setEndDate(endDate + label);
    }
  };

  const onPress = () => {
    setLoading(true);
    get("" + prefixMatricule + matricule).then(user => {
      if (user) {
        // puppeteerLogin(puppeteerSession).then(value => {
        // console.log("stringify:", JSON.stringify(value));
        // setPuppeteerSession(value.sessionId);
        // if (value.success == true) {
        setLoading(false);
        console.log("stringify:", JSON.stringify(user));
        router.push({
          pathname: '/Login_password',
          params: {
            user: JSON.stringify(user)
          },
        });
        // } else {
        //   setLoading(false);
        //   Alert.alert(
        //     "Erreur",
        //     "Iangaviana ianao mba ho any amin'ny biraon'ny RH",
        //     [{ text: "OK", style: "default" }]
        //   );
        // }
        // })
      } else {
        setLoading(false);
        Alert.alert(
          "Diso ny matricule",
          "Tsy misy ny matricule " + matricule + " tompoko!",
          [{ text: "OK", style: "default" }]
        );

      }
    })
  }

  const drop = () => {
    // setOpen(!open)
    // if(open) { setColor(black) } else { setColor(blue) } 
    router.push('/Admin_Login_email')
  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
      <View className="flex-1 bg-transparent px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
          <Text className="text-3xl font-bold">Ampidiro ny laharanao(matricule)</Text>
        </View>

        {/* ICON BUTTON */}
        <TouchableOpacity className='absolute top-10 z-40 right-5' onPress={() => drop()}>
          <MaterialCommunityIcons name="cog-outline" size={24} color={"black"} />
        </TouchableOpacity>

        <View className="m-0 justify-center px-20">

          <Text className="text-lg mb-2">Matricule:</Text>
          <LoadingModal
            visible={loading}
            // message="An-dala-mpiakarakarana ny fangatahanao tompoko. Mahadrasa kely..."
            message="Loading..."
          />
          <Pressable onPress={() => setActiveField("start")} >
            <TextInput
              value={matricule}
              placeholder="00000"
              editable={false}
              className={`w-full h-15 border rounded-md p-3 mb-3 bg-white text-3xl border-blue-500 shadow shadow-black text-gray-700`}
            />
          </Pressable>
          <View className="flex-row justify-center">
            <Button fontSize="" onPress={() => onPress()} label="OK" className="mx-10" />
            {/* <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" /> */}
          </View>
        </View>

        <View className="border-t border-y border-r border-l border-gray-300 pb-5 bg-transparent">
          <ScrollView>
            <View className="flex-row flex-wrap justify-center m-0 p-0">
              {buttons.map((label, index) => (
                <KeyboardButton
                  key={index}
                  label={label}
                  onPress={() => handleKeyPress(label)} />
              ))}
              <KeyboardButton
                backgroundColor='bg-gray-200'
                textColor='text-white'
                label={""}
                disabled
                onPress={() => handleKeyPress("")} />
              <KeyboardButton
                backgroundColor='bg-red-500'
                textColor='text-white'
                label={"FAFAINA"}
                onPress={() => handleKeyPress("FAFAINA")} />
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
