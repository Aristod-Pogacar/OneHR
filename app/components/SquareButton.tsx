import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Text, TouchableOpacity, View } from "react-native";

type MCIcons = keyof typeof MaterialCommunityIcons.glyphMap;

interface SquareButtonProps {
  onPress: () => void;
  icon: string;
  label?: string;
  firstColor?: string;
  secondColor?: string;
  blink?: boolean;
}

export const SquareButton: React.FC<SquareButtonProps> = ({
  label,
  icon,
  onPress,
  firstColor = "#1432BF",
  secondColor = "#01016E",
  blink = false,
}) => {
  return (
    <MotiView
      animate={
        blink
          ? { scale: [1, 1.1, 1] }
          : { scale: 1 }
      }
      transition={
        blink
          ? { loop: true, type: "timing", duration: 1000 }
          : undefined
      }
      style={{ margin: 8 }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={{
          width: 150,
          height: 150,
          borderRadius: 20,
          overflow: "hidden",
          // Ombre colorée selon firstColor
          shadowColor: firstColor,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <LinearGradient
          colors={[firstColor, secondColor]}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={{ flex: 1, padding: 16, alignItems: "center", justifyContent: "center" }}
        >
          {/* Couche glassmorphism */}
          <View
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "55%",
              backgroundColor: "rgba(255,255,255,0.10)",
              borderBottomWidth: 0,
            }}
          />

          {/* Bordure intérieure subtile */}
          <View
            style={{
              position: "absolute",
              inset: 0,
              top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)",
            }}
          />

          {/* Point lumineux si actif */}
          {blink && (
            <MotiView
              from={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0.4, scale: 1.4 }}
              transition={{ loop: true, type: "timing", duration: 900 }}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#fff",
              }}
            />
          )}

          {/* Icône avec halo */}
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: "rgba(255,255,255,0.13)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.22)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <MaterialCommunityIcons name={icon as any} size={36} color="#fff" />
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 13,
              fontWeight: "700",
              textAlign: "center",
              letterSpacing: 0.3,
              textShadowColor: "rgba(0,0,0,0.4)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
              lineHeight: 18,
            }}
          >
            {label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
};
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { MotiView } from "moti";
// import { Text, TouchableOpacity } from "react-native";

// type MCIcons = keyof typeof MaterialCommunityIcons.glyphMap;

// interface SquareButtonProps {
//   onPress: () => void;
//   icon: string;
//   label?: string;
//   backgroundColor?: string;
//   textColor?: string;
//   size?: string;
//   firstColor?: string;
//   secondColor?: string;
//   blink?: boolean;
// }

// export const SquareButton: React.FC<SquareButtonProps> = ({ label, icon, onPress, backgroundColor = "bg-cyan-500", textColor = "text-white", firstColor = "#0422AE", secondColor = "#01016E", blink = false }) => {
//   return (
//     <MotiView
//       animate={
//         blink
//           ? {
//             opacity: [1, 0.3, 1],
//             scale: [1, 1.05, 1],
//           }
//           : {
//             opacity: 1,
//             scale: 1,
//           }
//       }
//       transition={
//         blink
//           ? {
//             loop: true,
//             type: "timing",
//             duration: 400,
//           }
//           : undefined
//       }
//     >
//       <TouchableOpacity
//         className={`aspect-square ${backgroundColor} rounded-xl items-center justify-center shadow-sm m-2 w-[150px] overflow-hidden`}
//         onPress={onPress}
//       >
//         <LinearGradient
//           colors={[firstColor, secondColor]}
//           start={{ x: 0.2, y: 0.2 }}
//           end={{ x: 0.8, y: 0.8 }}
//           className="w-full h-full p-5 items-center justify-center"
//         >
//           <MaterialCommunityIcons
//             name={icon as any}
//             size={64}
//             color={textColor.replace("text-", "")}
//           />
//           <Text className={`${textColor} text-lg font-bold text-center`}>
//             {label}
//           </Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     </MotiView>
//   );
// };
