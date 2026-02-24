import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Text, TouchableOpacity } from "react-native";

type MCIcons = keyof typeof MaterialCommunityIcons.glyphMap;

interface SquareButtonProps {
  onPress: () => void;
  icon: string;
  label?: string;
  backgroundColor?: string;
  textColor?: string;
  size?: string;
  firstColor?: string;
  secondColor?: string;
  blink?: boolean;
}

export const SquareButton: React.FC<SquareButtonProps> = ({ label, icon, onPress, backgroundColor = "bg-cyan-500", textColor = "text-white", firstColor = "#0422AE", secondColor = "#01016E", blink = false }) => {
  return (
    <MotiView
      animate={
        blink
          ? {
            opacity: [1, 0.3, 1],
            scale: [1, 1.05, 1],
          }
          : {
            opacity: 1,
            scale: 1,
          }
      }
      transition={
        blink
          ? {
            loop: true,
            type: "timing",
            duration: 400,
          }
          : undefined
      }
    >
      <TouchableOpacity
        className={`aspect-square ${backgroundColor} rounded-xl items-center justify-center shadow-sm m-2 w-[150px] overflow-hidden`}
        onPress={onPress}
      >
        <LinearGradient
          colors={[firstColor, secondColor]}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 0.8, y: 0.8 }}
          className="w-full h-full p-5 items-center justify-center"
        >
          <MaterialCommunityIcons
            name={icon as any}
            size={64}
            color={textColor.replace("text-", "")}
          />
          <Text className={`${textColor} text-lg font-bold text-center`}>
            {label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
};
