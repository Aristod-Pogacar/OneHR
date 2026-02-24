import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import api from "./utils/axios";

async function post(data: { matricule: string; start_date: string; end_date: string; comment: any; leave_type: string; }) {
  await api.post('/leave/', data);
}

const leave_type = "Local_Leave_AMD";

export default function CongeAnnuel_DateFin() {
  const router = useRouter();

  const { startingDate, endingDate } = useLocalSearchParams();

  const { loggedUSer, bg1, bg2 } = useGlobal();

  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }

  const [remark, setRemark] = useState(""); // stocke la date de début (texte)
  const [endDate, setEndDate] = useState("");     // stocke la date de fin (texte)
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // champ sélectionné

  const onClick = () => {
      router.push({
        pathname: '/CongeAnnuel_ConfirmData',
        params: { 
          remark: remark,
          startingDate: startingDate,
          endingDate: endDate
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
    <View className="flex-1 px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Hangataka fialan-tsasatra isan-taona</Text>
        </View>
      
      {/* --- Champs de saisie --- */}
      <View className="m-0">
        {/* <Text className="text-2xl font-bold mb-4">Demande de congé</Text> */}

        <Text className="text-lg mb-2">Fanamarihana</Text>
        <Pressable onPress={() => setActiveField("start")}>
            <TextInput value={remark} onChangeText={(value) => setRemark(value)} placeholder="Fanamarihana momba ny fangatahana" className={`w-full h-12 border rounded-md p-3 mb-3 border-blue-500`} autoFocus
            />
        </Pressable>
        <View className="flex-row justify-center">
            <Button fontSize="" onPress={ () => onClick() } label="OK" className="mx-10" />
              {/* <View className="p-10 m-10"></View> */}
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
            {/* <Button onPress={ () => console.log("OK") } label="OK" /> */}
        </View>
      </View>

      {/* --- Clavier personnalisé --- */}
      <View className="pb-5 h-3/4">
        <ScrollView>
          <View className="flex-row flex-wrap justify-center m-0 p-0">
          </View>
        </ScrollView>
      </View>
    </View>
    </LinearGradient>
  );
}
