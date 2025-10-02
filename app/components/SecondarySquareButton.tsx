import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";

interface SecondarySquareButtonProps {
    onPress: () => void;
    icon: string;
    label?: string;
    backgroundColor?: string;
    textColor?: string;
    size?: string;
  }
  
export const SecondarySquareButton: React.FC<SecondarySquareButtonProps> = ({ label, icon, onPress, backgroundColor = "bg-cyan-500", textColor = "text-white" }) => {
  return (
    <TouchableOpacity
      className={`aspect-square ${backgroundColor} rounded-xl items-center justify-center shadow-xl m-2 w-[150px]  overflow-hidden`}
      onPress={onPress}>
        <LinearGradient
        colors={["#404040", "#000000"]}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
        className="w-full h-full p-5 items-center justify-center"
      >

      <MaterialIcons name={icon} size={64} color={textColor.replace("text-", "")} />
      <Text className={`${textColor} adjustsFontSizeToFit text-lg font-bold text-center`} style={{ flexWrap: "wrap" }}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
