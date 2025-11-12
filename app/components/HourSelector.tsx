import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type HourSelectorProps = {
  onChange?: (hour: number, minute: number) => void;
}

export default function HourSelector({ onChange }: HourSelectorProps) {
  const today = new Date();
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const [hour, setHour] = useState<number>(today.getHours() + 1);
  const [minute, setMinute] = useState<number>(today.getMinutes());

  const increaseHour = () => {
    const newHour = (hour + 1) % 24;
    setHour(newHour);
    onChange?.(newHour, minute);
  };

  const decreaseHour = () => {
    const newHour = (hour - 1 + 24) % 24;
    setHour(newHour);
    onChange?.(newHour, minute);
  };

  const increaseMinute = () => {
    const newMinute = (minute + 5) % 60;
    setMinute(newMinute);
    onChange?.(hour, newMinute);
  };

  const decreaseMinute = () => {
    const newMinute = (minute - 5 + 60) % 60;
    setMinute(newMinute);
    onChange?.(hour, newMinute);
  };

  return (
    <View className="flex-row justify-center space-x-10">
      <View className="items-center mx-1">
        <TouchableOpacity onPress={increaseHour} className="shadow-xl rounded-xl overflow-hidden">
            <LinearGradient
                colors={["#ffffff", "#ffffff"]}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 0.8, y: 0.8 }}
                className="p-6 items-center justify-center"
            >
              <Text className="text-2xl font-bold">▲</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text className="text-5xl font-extrabold my-4 p-2">{hour.toString().padStart(2, "0")} h</Text>
        <TouchableOpacity onPress={decreaseHour} className="shadow-xl rounded-xl overflow-hidden">
            <LinearGradient
            colors={["#ffffff", "#ffffff"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            className="p-6 items-center justify-center"
            >
                <Text className="text-2xl font-bold">▼</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>

      <View className="items-center mx-1">
        <TouchableOpacity onPress={increaseMinute} className="shadow-xl rounded-xl overflow-hidden">
            <LinearGradient
                colors={["#ffffff", "#ffffff"]}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 0.8, y: 0.8 }}
                className="p-6 items-center justify-center"
            >
              <Text className="text-2xl font-bold">▲</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text className="text-5xl font-extrabold my-4 p-2">{minute.toString().padStart(2, "0")} min</Text>
        <TouchableOpacity onPress={decreaseMinute} className="shadow-xl rounded-xl overflow-hidden">
            <LinearGradient
            colors={["#ffffff", "#ffffff"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            className="p-6 items-center justify-center"
            >
                <Text className="text-2xl font-bold">▼</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
};
