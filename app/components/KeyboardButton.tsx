import { Text, TouchableOpacity, useWindowDimensions } from "react-native";

interface KeyboardButtonProps {
  onPress: () => void;
  label?: string;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
}

export const KeyboardButton: React.FC<KeyboardButtonProps> = ({
  label,
  onPress,
  backgroundColor = "bg-transparent",
  textColor = "text-white",
  disabled = false,
}) => {
  const { width } = useWindowDimensions();

  // 12 touches par ligne max, 5 colonnes visibles, marges comprises
  const numColumns = 5;
  const totalMargin = 10 * numColumns;
  const buttonSize = Math.floor((width - totalMargin) / numColumns) - 12;
  const fontSize = Math.max(18, Math.floor(buttonSize * 0.28));

  return (
    <TouchableOpacity
      style={{
        width: buttonSize,
        height: buttonSize * 0.55, // moins haut que large = plus compact
        margin: 5,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: disabled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      className={backgroundColor}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        className={textColor}
        style={{ fontSize, fontWeight: "700", textAlign: "center" }}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};