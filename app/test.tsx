import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import DateSelector from "./components/DateSelector";
import NumericSlashInput from "./components/NumericSlashInput";

export default function CongeAnnuel_DateFin() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <View className="flex-1 bg-white px-20 justify-center">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Hangataka fialan-tsasatra isan-taona</Text>
        </View>
      
      {/* --- Champs de saisie --- */}
      <View className="m-0">
        {/* <Text className="text-2xl font-bold mb-4">Demande de congé</Text> */}

        <Text className="text-lg">TEST:</Text>
        <DateSelector  onChange={(date) => setSelectedDate(date)}/>
        <NumericSlashInput />
        {/* <View className="flex-row justify-center"> */}
            {/* <Button fontSize="" onPress={ () => console.log("OK") } label="OK" className="mx-10" /> */}
              {/* <View className="p-10 m-10"></View> */}
            {/* <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" /> */}
            {/* <Button onPress={ () => console.log("OK") } label="OK" /> */}
        {/* </View> */}
      </View>
    </View>
  );
}
