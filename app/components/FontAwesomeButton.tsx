// Fichier : LoginButton.tsx

import { FontAwesome } from "@expo/vector-icons";
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

// Définissez le type des props attendues par le composant
interface FontAwesomeButtonProps {
  link: string;
  fontAwesome: string;
  label: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
}

export const FontAwesomeButton: React.FC<FontAwesomeButtonProps> = ({ link, fontAwesome, label, backgroundColor = 'bg-cyan-500', textColor = 'text-white' }, fontSize = '') => {
  return (
    <Link href={link} className={`w-50 ${backgroundColor} aspect-square justify-center items-center text-center rounded-10 m-10`}>
        <View className={`${backgroundColor} h-full w-full justify-center items-center text-center`}>
            <FontAwesome name={fontAwesome} size={30} color="white" />
            <Text className={textColor}>{label}</Text>
        </View>
    </Link>
  );
};
