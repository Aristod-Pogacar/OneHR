import { Text, TouchableOpacity } from "react-native";

interface KeyboardButtonProps {
    onPress: () => void;
    label?: string;
    backgroundColor?: string;
    textColor?: string;
    size?: string;
    disabled?: boolean
  }
  
export const KeyboardButton: React.FC<KeyboardButtonProps> = ({ label, onPress, backgroundColor = "bg-white", textColor = "text-neutral-800", disabled = false }) => {
  return (
    <TouchableOpacity
      className={`aspect-square ${backgroundColor} rounded-xl items-center justify-center shadow-xl m-5 w-[150px]  overflow-hidden border border-neutral-200 border-1`}
      onPress={onPress} disabled={disabled}>
      <Text className={`${textColor} adjustsFontSizeToFit text-3xl font-bold text-center`} style={{ flexWrap: "wrap" }}>{label}</Text>
    </TouchableOpacity>
  );
}
