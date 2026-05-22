import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

interface SecondarySquareButtonProps {
  onPress: () => void;
  icon: string;
  label?: string;
}

export const SecondarySquareButton: React.FC<SecondarySquareButtonProps> = ({
  label,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        width: 150,
        height: 150,
        borderRadius: 20,
        overflow: "hidden",
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.55,
        shadowRadius: 16,
        elevation: 12,
      }}
    >
      <LinearGradient
        colors={["#3a3a3a", "#111111"]}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}
      >
        {/* Reflet glassmorphism */}
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "55%",
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />

        {/* Bordure intérieure */}
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
          }}
        />

        {/* Point rouge logout */}
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#ff4d4d",
            shadowColor: "#ff4d4d",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 6,
          }}
        />

        {/* Icône avec halo */}
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.14)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <MaterialCommunityIcons name={icon as any} size={36} color="rgba(255,255,255,0.9)" />
        </View>

        <Text
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 13,
            fontWeight: "700",
            textAlign: "center",
            letterSpacing: 0.3,
            textShadowColor: "rgba(0,0,0,0.6)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 4,
          }}
        >
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { Text, TouchableOpacity } from "react-native";

// interface SecondarySquareButtonProps {
//     onPress: () => void;
//     icon: string;
//     label?: string;
//     backgroundColor?: string;
//     textColor?: string;
//     size?: string;
//   }
  
// export const SecondarySquareButton: React.FC<SecondarySquareButtonProps> = ({ label, icon, onPress, backgroundColor = "bg-cyan-500", textColor = "text-white" }) => {
//   return (
//     <TouchableOpacity
//       className={`aspect-square ${backgroundColor} rounded-xl items-center justify-center shadow-xl m-2 w-[150px]  overflow-hidden`}
//       onPress={onPress}>
//         <LinearGradient
//         colors={["#404040", "#000000"]}
//         start={{ x: 0.2, y: 0.2 }}
//         end={{ x: 0.8, y: 0.8 }}
//         className="w-full h-full p-5 items-center justify-center"
//       >

//       <MaterialCommunityIcons name={icon} size={64} color={textColor.replace("text-", "")} />
//       <Text className={`${textColor} adjustsFontSizeToFit text-lg font-bold text-center`} style={{ flexWrap: "wrap" }}>{label}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// }
