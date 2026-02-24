import { Text, TouchableOpacity, View } from "react-native";

type RadioProps = {
    onPress?: (value: string) => void; // callback optionnelle
    value: string;
    isSelected?: boolean;
};

// Adjust the existing RadioButton component to be controlled by its parent
export function RadioButton({ isSelected = false, onPress, value }: RadioProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(value);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center space-x-2 py-2"
    >
      <View
        className={`w-6 h-6 rounded-full border ${isSelected ? 'border-blue-600' : 'border-gray-500'} flex items-center justify-center`}
      >
        {isSelected && (
          <View className="w-3 h-3 bg-blue-600 rounded-full" />
        )}
      </View>
      <Text className="text-base m-2">{value}</Text>
    </TouchableOpacity>
  );
}
