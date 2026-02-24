import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export async function playVoice(source: any) {
    try {
        // 🔴 Arrêter et libérer l’ancien son s’il existe
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            sound = null;
        }

        // 🟢 Créer le son
        const { sound: newSound } = await Audio.Sound.createAsync(
            source,
            { shouldPlay: false } // ⚠️ IMPORTANT
        );

        sound = newSound;

        // ⏳ Attendre que le son soit bien chargé
        await sound.loadAsync(source);

        // ▶️ Lancer la lecture
        await sound.playAsync();
    } catch (error) {
        console.log("Erreur audio:", error);
    }
}

export async function stopVoice() {
    if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        sound = null;
    }
}
