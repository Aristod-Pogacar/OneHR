import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import HourSelector from "./components/HourSelector";

export default function Permission2h_StartingHour() {
  const today = new Date();
  console.log("Hour:", today.getHours());
  console.log("Minute:", today.getMinutes());
  
  today.setSeconds(0);
  today.setMilliseconds(0);
  const router = useRouter();
  const [startingHour, setStartingHour] = useState<number>(today.getHours());
  const [startingMinute, setStartingMinute] = useState<number>(today.getMinutes());

  const onchange = (hour: number, minute: number) => {
    setStartingHour(hour);
    setStartingMinute(minute);
    console.log(hour.toString().padStart(2, "0").concat(":" + minute.toString().padStart(2, "0")))
  }

  const clicked = () => {

      router.push({
        pathname: "/Permission2h_EndingHour",
        params: { 
          startingHour: startingHour,
          startingMinute: startingMinute
        },
      });

  }

  return (
    <View className="flex-1 bg-white px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
            <Text className="text-3xl font-bold">Fangatahana fierana 2h</Text>
        </View>

      <View className="m-0">
        <View className="items-center justify-center mb-5">
          <Text className="text-2xl mb-2">Ora hivoahana</Text>
        </View>
        <HourSelector onChange={(hour, minute) => onchange(hour, minute)} />
        <View className="flex-row justify-center mt-10">
            {/* <Button fontSize="" onPress={ () => console.log("OK") } label="OK" className="mx-10" /> */}
            <Button fontSize="" onPress={ () => clicked() } label="OK" className="mx-10" />
            <ButtonSecondary fontSize="" onPress={ () => router.back() } label="Hiverina" className="mx-10" />
        </View>
      </View>
    </View>
  );
}
