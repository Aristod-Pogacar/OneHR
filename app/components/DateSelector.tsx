import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type DateSelectorProps = {
    onChange?: (date: Date) => void; // callback optionnelle
};
  
export default function DateSelector({ onChange }: DateSelectorProps) {
  const today = new Date();
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];
  const adjustDayForMonth = (day: number, month: number, year: number) => {
    const maxDays = new Date(year, month, 0).getDate(); // dernier jour du mois
    return Math.min(day, maxDays); // renvoie le jour valide
  };
  
  const updateDate = (d: number, m: number, y: number) => {
    const newDate = new Date(y, m - 1, d);
    if (onChange) onChange(newDate); // 🔥 envoie la date vers le parent
  };

  const incrementDay = () => {
    let maxDays = new Date(year, month, 0).getDate();
    let newDay = day < maxDays ? day + 1 : 1;
    setDay(newDay);
    updateDate(newDay, month, year);
  };

  const decrementDay = () => {
    let maxDays = new Date(year, month, 0).getDate();
    let newDay = day > 1 ? day - 1 : maxDays;
    setDay(newDay);
    updateDate(newDay, month, year);
  };

  const incrementMonth = () => {
    let newMonth = month < 12 ? month + 1 : 1;
    setMonth(newMonth);
    const maxD = adjustDayForMonth(day, newMonth, year)
    if (day > maxD ) {
      updateDate(maxD, newMonth, year);
      setDay(maxD)
    } else {
      updateDate(day, newMonth, year);
    }
  };

  const decrementMonth = () => {
    let newMonth = month > 1 ? month - 1 : 12;
    setMonth(newMonth);
    const maxD = adjustDayForMonth(day, newMonth, year)
    if (day > maxD ) {
      updateDate(maxD, newMonth, year);
      setDay(maxD)
    } else {
      updateDate(day, newMonth, year);
    }
  };

  const incrementYear = () => {
    let newYear = year + 1;
    setYear(newYear);
    const maxD = adjustDayForMonth(day, month, newYear)
    if (day > maxD ) {
      updateDate(maxD, month, newYear);
      setDay(maxD)
    } else {
      updateDate(day, month, newYear);
    }
  };

  const decrementYear = () => {
    let newYear = year - 1;
    setYear(newYear);
    const maxD = adjustDayForMonth(day, month, newYear)
    if (day > maxD ) {
      updateDate(maxD, month, newYear);
      setDay(maxD)
    } else {
      updateDate(day, month, newYear);
    }
  };

  return (
    <View className="flex-row justify-center space-x-10">
      {/* Jour */}
      <View className="items-center mx-1">
        <TouchableOpacity onPress={incrementDay} className="shadow-xl rounded-xl overflow-hidden">
            <LinearGradient
                colors={["#ffffff", "#ffffff"]}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 0.8, y: 0.8 }}
                className="p-6 items-center justify-center"
            >
              <Text className="text-2xl font-bold">▲</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text className="text-3xl font-extrabold my-4 p-2">{day}</Text>
        <TouchableOpacity onPress={decrementDay} className="shadow-xl rounded-xl overflow-hidden">
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

      {/* Mois */}
      <View className="items-center mx-1 w-80">
        <TouchableOpacity onPress={incrementMonth} className="bg-green-300 shadow-xl rounded-xl overflow-hidden">
            <LinearGradient
            colors={["#ffffff", "#ffffff"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            className="p-6 items-center justify-center"
            >
              <Text className="text-2xl font-bold">▲</Text>
            </LinearGradient>
        </TouchableOpacity>
        <Text className="text-3xl font-extrabold my-4 p-2">{monthNames[month - 1]}</Text>
        <TouchableOpacity onPress={decrementMonth} className="bg-green-300 shadow-xl rounded-xl overflow-hidden">
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

      {/* Année */}
      <View className="items-center mx-1">
        <TouchableOpacity onPress={incrementYear} className="bg-purple-300 shadow-xl rounded-xl overflow-hidden">
            <LinearGradient
            colors={["#ffffff", "#ffffff"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            className="p-6 items-center justify-center"
            >
              <Text className="text-2xl font-bold">▲</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text className="text-3xl font-extrabold my-4 p-2">{year}</Text>
        <TouchableOpacity onPress={decrementYear} className="bg-purple-300 shadow-xl rounded-xl overflow-hidden">
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
}
