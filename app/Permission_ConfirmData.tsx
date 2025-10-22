import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Text, View } from "react-native";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";

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

  function calculerDifferenceEnJours(date1: Date, date2: Date) {
    const MS_PAR_JOUR = 1000 * 60 * 60 * 24;

    const differenceEnMs = date2.getTime() - date1.getTime();
    return Math.floor(Math.abs(differenceEnMs / MS_PAR_JOUR));
  }
  
  const st = new Date(startingDate)
  const en = new Date(endingDate)
  const reste = calculerDifferenceEnJours(st, en);

  const onClick = () => {
    console.log('Différence:', reste);
    Alert.alert(
      "Fangatahana fierana",
      "Voaray ny fangatahana fierana (antony: \"" + permissionMotif +
      "\") mandritry ny " + reste + " andro nataonao tompoko. Efa an-dalana ny fandinihina izany.",
      [{ text: "OK", style: "default" }]
    );
    router.push('/');
  }

  return (
    <View className="flex-1 bg-white px-20 pt-4 justify-center">
      <View className="items-center justify-center mt-5 mb-5">
        <Text className="text-3xl font-bold">Fangatahana fierana</Text>
      </View>

      <View className="mt-5">
        <View className="mb-5">
          <Text className="text-xl mb-2"><Text className="font-bold">Antony:</Text> {permissionMotif}</Text>
          <Text className="text-xl mb-2"><Text className="font-bold">Daty tsy hiasana:</Text> {st.toLocaleDateString('mg-MG', options)}</Text>
          <Text className="text-xl mb-2"><Text className="font-bold">Daty hiverenena miasa:</Text> {en.toLocaleDateString('mg-MG', options)}</Text>
          <Text className="text-xl mb-2"><Text className="font-bold">Andro tsy hiasana:</Text> {reste}</Text>
        </View>

        <View className="flex-row justify-center mt-10">
            <Button fontSize="" onPress={ () => onClick() } label="OK" className="mx-10" />
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
        </View>
      </View>
    </View>
  );
}
