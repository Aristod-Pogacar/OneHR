import { ActivityIndicator, Modal, Text, View } from "react-native";

type LoadingModalProps = {
  visible: boolean;
  message?: string;
};

export const LoadingModal: React.FC<LoadingModalProps> = ({ visible, message = "Chargement..." }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40 items-center justify-center">
        <View className="bg-white rounded-2xl p-6 w-72 items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-lg font-semibold text-center">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
