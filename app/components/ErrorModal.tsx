import React from "react";
import { Modal, Text, View } from "react-native";

type ErrorModalProps = {
    visible: boolean;
    message?: string;
    onClose: () => void;
};

export const ErrorModal: React.FC<ErrorModalProps> = ({
    visible,
    message = "Une erreur est survenue.",
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white rounded-2xl p-6 w-72 items-center">

                    {/* Icône erreur */}
                    <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center">
                        <Text className="text-3xl font-bold text-red-600">
                            !
                        </Text>
                    </View>

                    {/* Titre */}
                    <Text className="mt-4 text-xl font-bold text-gray-900 text-center">
                        Erreur
                    </Text>

                    {/* Message */}
                    <Text className="mt-2 text-base text-gray-600 text-center">
                        {message}
                    </Text>

                    {/* Bouton */}
                    {/* <TouchableOpacity
                        onPress={onClose}
                        className="mt-6 bg-red-600 rounded-xl px-8 py-3"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-semibold text-base">
                            Fermer
                        </Text>
                    </TouchableOpacity> */}

                </View>
            </View>
        </Modal>
    );
};