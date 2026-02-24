import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import { KeyboardButton } from "./components/KeyboardButton";
import { LoadingModal } from "./components/LoadingModal";
import api from "./utils/axios";

async function compare(data: any): Promise<any> {
  try {
    const path = '/admin/compare';
    const response = await api.post(path, {
      matricule: data.matricule,
      password: data.password
    });

    return response.data; // 👍 toujours un return
  } catch (error) {
    console.log("Compare error:", error);
    return null; // 👍 ne retourne jamais undefined
  }
}

async function puppeteerLogin(sessionID: string, data: any): Promise<any> {
  try {
    const path = '/bot/' + sessionID + '/login';
    const response = await api.post(path, {
      username: data.matricule,
      encryptedPassword: data.password
    });

    return response.data; // 👍 toujours un return
  } catch (error) {
    console.log("Compare error:", error);
    return null; // 👍 ne retourne jamais undefined
  }
}

async function loginToOneHR(sessionId: string, data: any): Promise<any> {
  try {
    const path = '/bot/' + sessionId + '/login';
    const response = await api.post(path, {
      username: data.matricule,
      encryptedPassword: data.password
    });

    return response.data; // 👍 toujours un return
  } catch (error) {
    console.log("Compare error:", error);
    return null; // 👍 ne retourne jamais undefined
  }
}

export default function Login_password() {
  const router = useRouter();
  const [password, setPassword] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné
  const { user } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const { setLoggedUser, bg1, bg2, puppeteerSession } = useGlobal();

  const jsonUser = JSON.parse(user.toString())

  const buttons = [
    "1", "2", "3", "4",
    "5", "6", "7", "8",
    "9", "0",
  ];

  // ✅ Ajout d’un chiffre ou suppression
  const handleKeyPress = (label: string) => {
    if (label === "FAFAINA") {
      if (activeField === "start") setPassword(password.slice(0, -1));
      else setEndDate(endDate.slice(0, -1));
    } else {
      if (activeField === "start") setPassword(password + label);
      else setEndDate(endDate + label);
    }
  };

  const onPress = async () => {
    setLoading(true);
    const test = await compare({
      matricule: jsonUser.matricule,
      password: password
    })
    console.log("test:", test);

    if (!test) {
      setLoading(false);
      Alert.alert(
        "Erreur !",
        "Mangataka anao mba hamerina tompoko",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    // if (password === jsonUser.appPassword) {
    if (test.isAdmin) {
      // puppeteerLogin(puppeteerSession, {
      //   matricule: jsonUser.matricule,
      //   password: jsonUser.password
      // }).then(value => {
      // console.log("stringify:", JSON.stringify(value));
      // if (value.success == true) {
      console.log('PASSWORD:', jsonUser.password);

      setLoggedUser(jsonUser)

      router.push({
        pathname: '/Menu',
        params: {
          user: JSON.stringify(jsonUser)
        },
      });
      setLoading(false);
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
      Alert.alert(
        "Diso ny teny miafina",
        "Diso ny teny miafina! Mamerena mampiditra azafady",
        [{ text: "OK", style: "default" }]
      );
      setLoading(false);
    }
    // router.push({
    //   pathname: '/Login_password',
    //   params: { 
    //     user: JSON.stringify(value)
    //   },
    // });
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
          <Text className="text-3xl font-bold">Anarana: {jsonUser.fullname}</Text>
          {/* <Text className="text-2xl font-bold">Ampidiro ny teny miafina</Text> */}
        </View>

        <View className="m-0 justify-center px-20">

          <Text className="text-lg mb-2">Teny miafina:</Text>
          <Pressable onPress={() => setActiveField("start")}>
            <TextInput
              value={password}
              placeholder="Teny miafina"
              editable={false}
              className={`w-full h-15 border rounded-md p-3 mb-3 bg-white text-xl border-blue-500 shadow shadow-black text-gray-700`}
              // style={{ fontWeight: 'bold' }}
              secureTextEntry
            />
          </Pressable>
          <View className="flex-row justify-center">
            <Button fontSize="" onPress={() => onPress()} label="OK" className="mx-10" />
            <ButtonSecondary fontSize="" onPress={() => router.back()} label="Hiverina" className="mx-10" />
          </View>
        </View>
        <LoadingModal
          visible={loading}
          // message="An-dala-mpiakarakarana ny fangatahanao tompoko. Mahadrasa kely..."
          message="Loading..."
        />

        <View className="border-t border-y border-r border-l border-gray-300 pb-5">
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
                onPress={() => console.log("pressed")} />
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
