import React from "react";
import { Image } from "react-native";

interface LogoProps {
  size?: number; // Taille personnalisée
}

export const Logo: React.FC<LogoProps> = ({ size = 50 }) => {
  return (
    <Image
      source={require("../../assets/oneHR-Logo.png")} // Mets ton chemin exact
      style={{ width: size, height: size, marginBottom: 12 }}
      className="rounded-xl" // Ici tu peux mettre tes classes Tailwind fixes
      resizeMode="contain"
    />
  );
};
