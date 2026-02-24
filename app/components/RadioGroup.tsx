import { useState } from "react";
import { View } from "react-native";
import { RadioButton } from "./RadioButton";

type RadioGroupProps = {
  options: string[];
  onValueChange: (value: string) => void;
  initialValue?: string;
};

export function RadioGroup({ options, onValueChange, initialValue }: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(initialValue);

  const handleRadioButtonPress = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
  };

  return (
    <View className="flex-col">
      {options.map((option) => (
        <RadioButton
          key={option}
          value={option}
          isSelected={selectedValue === option}
          onPress={handleRadioButtonPress}
        />
      ))}
    </View>
  );
}
    