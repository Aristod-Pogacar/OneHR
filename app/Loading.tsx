import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, BackHandler, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { LoadingModal } from "./components/LoadingModal";
import api from "./utils/axios";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPuppeteerSession(): Promise<any> {
    try {
        const path = '/bot/session';
        const response = await api.post(path);

        return response.data; // 👍 toujours un return
    } catch (error) {
        console.log("ERROR:", error);
        return null; // 👍 ne retourne jamais undefined
    }
}

async function puppeteerStart(sessionId: string): Promise<any> {
    try {
        const path = '/bot/' + sessionId + '/start';
        const response = await api.post(path);

        return response.data; // 👍 toujours un return
    } catch (error) {
        console.log("ERROR:", error);
        return null; // 👍 ne retourne jamais undefined
    }
}

// async function puppeteerStart(sessionId: string) {
//     var results
//     const path = '/bot/' + sessionId + '/start'
//     console.log("path:", path);

//     await api.get(path).then(value => { results = value.data });

//     return results
// }

export default function Loading() {
    const [loading, setLoading] = useState(true);
    const { setPuppeteerSession } = useGlobal();

    useEffect(() => {
        setLoading(true);

        getPuppeteerSession()
            .then(async (session: any) => {

                if (!session || !session.sessionId) {
                    throw new Error("Invalid session response");
                }

                setPuppeteerSession(session.sessionId);
                console.log("GET SESSION:", session);

                await delay(3000);

                return puppeteerStart(session.sessionId);
            })
            .then((result: any) => {

                console.log("START SESSION:", result);

                if (result?.success) {
                    router.push('/Login_matricule');
                } else {
                    Alert.alert("Error",
                        "Une erreur est survenue. L'application va se fermer.",
                        [{ text: "OK", onPress: () => BackHandler.exitApp() }],
                        { cancelable: false });
                }
            })
            .catch((error) => {
                console.log("ERROR:", error);
                Alert.alert("Error",
                    "Une erreur est survenue. L'application va se fermer.",
                    [{ text: "OK", onPress: () => BackHandler.exitApp() }],
                    { cancelable: false });
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    // useEffect(() => {
    //     try {
    //         getPuppeteerSession().then(async (value: any) => {
    //             setPuppeteerSession(value.sessionId);
    //             console.log("GET SESSION:", JSON.stringify(value));
    //             await delay(3000);
    //             await puppeteerStart(value.sessionId).then((value: any) => {
    //                 console.log("START SESSION:", JSON.stringify(value));
    //                 if (value.success == true) {
    //                     setLoading(false);
    //                     router.push('/Login_matricule');
    //                 } else {
    //                     setLoading(false);
    //                     // console.log("stringify:", JSON.stringify(value));
    //                     Alert.alert("Error", "Restart the app to try again");
    //                 }
    //             });
    //         });
    //     } catch (error) {
    //         setLoading(false);
    //         console.log("error:", error);
    //         Alert.alert("Error", "Restart the app to try again");
    //     }
    // }, []);

    return (
        <View className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <LoadingModal
                visible={loading}
                // message="An-dala-mpiakarakarana ny fangatahanao tompoko. Mahadrasa kely..."
                message="Loading..."
            />

            {/* <View className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></View> */}
        </View>
    );
}
