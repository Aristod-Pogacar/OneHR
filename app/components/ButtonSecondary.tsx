// Fichier : LoginButton.tsx

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

// Définissez le type des props attendues par le composant
interface ButtonSecondaryProps {
  onPress: () => void;
  label?: string;
  textColor?: string;
  size?: string;
  fontSize?: string;
  className?: string;
}

export const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({ onPress, label, textColor = 'text-white', size = 'w-[150px]' }, fontSize = '', className = '') => {
  return (
    <TouchableOpacity
      className={`${size} h-12 rounded-full items-center justify-center mb-4 mx-4 overflow-hidden ${className}`}
      onPress={onPress}
    >
        <LinearGradient
        colors={["#404040", "#000000"]}
        className="w-full h-full items-center justify-center"
      >
      <Text className={`${textColor} ${fontSize} text-lg font-semibold`}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};