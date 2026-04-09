import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import { LoadingModal } from "./components/LoadingModal";
import api from "./utils/axios";

type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

async function post(data: { employee: string; start_date: string; end_date: string; reason: any; leave_type: string; }) {
  return await api.post('/api/leave', data);
  // return await api.post('/bot/full-leave', data);
}

const leave_type = "Permission_AMD";

export default function Permission_ConfirmData() {

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const router = useRouter();
  const { permissionMotif, startingDate, endingDate } = useLocalSearchParams();
  const { loggedUSer, bg1, bg2 } = useGlobal();
  const [loading, setLoading] = useState(false);

  if (loggedUSer == null) {
    router.push('/Login_matricule');
    return;
  }

  function calculerDifferenceEnJours(date1: Date, date2: Date) {
    const MS_PAR_JOUR = 1000 * 60 * 60 * 24;

    const differenceEnMs = date2.getTime() - date1.getTime();
    return Math.floor(Math.abs(differenceEnMs / MS_PAR_JOUR));
  }

  const st = new Date(startingDate.toString())
  const en = new Date(endingDate.toString())
  const reste = calculerDifferenceEnJours(st, en);

  en.toLocaleDateString()

  const onClick = async () => {
    setLoading(true);
    console.log('Différence:', reste);
    const data = {
      "employee": "" + loggedUSer.matricule,
      // "start_date": "" + st.getMonth() + "/" + st.getDate() + "/" + st.getFullYear(),
      // "end_date": "" + en.getMonth() + "/" + (en.getDate() - 1) + "/" + en.getFullYear(),
      "start_date": "" + st.getFullYear() + "-" + (st.getMonth() + 1) + "-" + st.getDate(),
      "end_date": "" + en.getFullYear() + "-" + (en.getMonth() + 1) + "-" + (en.getDate() - 1),
      "reason": permissionMotif,
      "leave_type": leave_type
    }
    await post(data).then(async (response) => {
      if (response.status == 400) {
        if (response.data.message == "Leave dates overlap with existing leave") {
          Alert.alert(
            "Tsy voaray ny fangatahana",
            "Efa misy fangatahana fierana na conge hafa amin'io daty io tompoko.",
            [{ text: "OK", style: "default" }]
          );
          setLoading(false);
        } else if (response.data.message == "Local leave solde not enough" || response.data.message == "Permission solde not enough") {
          setLoading(false);
          Alert.alert(
            "Tsy voaray ny fangatahana",
            "Tsy ampy ny solde conge anao tompoko.",
            [{ text: "OK", style: "default" }]
          );
        }
      } else if (response.status == 201 || response.status == 200) {
        ;
        Alert.alert(
          "Fangatahana fierana",
          "Voaray ny fangatahana fierana (antony: \"" + permissionMotif +
          "\") mandritry ny " + reste + " andro nataonao tompoko. Efa an-dalana ny fandinihina izany.",
          [{ text: "OK", style: "default" }]
        );
        setLoading(false);

        router.push('/Menu');
      } else {
        Alert.alert(
          "Tsy voaray ny fangatahana",
          "Tsy voaray ny fangatahana tompoko. Avereno azafady",
          [{ text: "OK", style: "default" }]
        );
        setLoading(false);
      }
    });
  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
      <View className="flex-1 px-20 pt-4 justify-center">
        <View className="items-center justify-center mt-5 mb-5">
          <Text className="text-3xl font-bold">Fangatahana fierana</Text>
        </View>
        <LoadingModal
          visible={loading}
          // message="An-dala-mpiakarakarana ny fangatahanao tompoko. Mahadrasa kely..."
          message="Loading..."
        />

        <View className="mt-5">
          <View className="mb-5">
            <Text className="text-xl mb-2"><Text className="font-bold">Antony:</Text> {permissionMotif}</Text>
            <Text className="text-xl mb-2"><Text className="font-bold">Daty tsy hiasana:</Text> {st.toLocaleDateString('mg-MG', options as DateTimeFormatOptions)}</Text>
            <Text className="text-xl mb-2"><Text className="font-bold">Daty hiverenena miasa:</Text> {en.toLocaleDateString('mg-MG', options as DateTimeFormatOptions)}</Text>
            <Text className="text-xl mb-2"><Text className="font-bold">Andro tsy hiasana:</Text> {reste}</Text>
          </View>

          <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={() => onClick()} label="OK" className="mx-10" />
            <ButtonSecondary fontSize="" onPress={() => router.back()} label="Hiverina" className="mx-10" />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
