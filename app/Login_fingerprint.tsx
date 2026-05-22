import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { MotiView } from "moti";
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useGlobal } from './Providers/GlobalProvider';
import { useSocket } from './hooks/useSocket';

export default function Login_fingerprint() {
    const router = useRouter();
    const [status, setStatus] = useState<'waiting' | 'success' | 'failed'>('waiting');
    const [employee, setEmployee] = useState<any>(null);
    const [sent, setSent] = useState<boolean>(false);
    const { setLoggedUser, bg1, bg2 } = useGlobal();

    const { send } = useSocket({
        login_success: (data) => {
            setEmployee(data.employee);
            setStatus('success');
            setLoggedUser(data.employee);
            if (!sent) {
                setSent(true);
                setTimeout(() => {
                    router.push({ pathname: '/Menu', params: { user: JSON.stringify(data.employee) } });
                }, 1500);
            }
        },
        login_failed: () => {
            setStatus('failed');
            setTimeout(() => setStatus('waiting'), 2000);
        },
    });

    useEffect(() => {
        const timer = setTimeout(() => send('start_listening'), 500);
        return () => { clearTimeout(timer); send('stop_listening'); };
    }, []);

    // Couleurs dynamiques selon le statut
    const statusConfig = {
        waiting: {
            bg: "rgba(255,255,255,0.07)",
            border: "rgba(255,255,255,0.13)",
            color: "rgba(255,255,255,0.8)",
            ringColor: "rgba(100,140,255,0.35)",
            text: "En attente d'empreinte...",
        },
        success: {
            bg: "rgba(39,180,0,0.15)",
            border: "rgba(39,180,0,0.35)",
            color: "#5dfc2a",
            ringColor: "rgba(39,180,0,0.4)",
            text: `Bonjour, ${employee?.fullname ?? employee?.name} !`,
        },
        failed: {
            bg: "rgba(220,50,50,0.15)",
            border: "rgba(220,50,50,0.35)",
            color: "#ff6b6b",
            ringColor: "rgba(220,50,50,0.4)",
            text: "Empreinte non reconnue",
        },
    };

    const drop_settings = () => {
        send('stop_listening')
        router.push('/Admin_Login_email')
    }

    const drop_ip = () => {
        send('stop_listening')
        router.push('/Setting_ip_address')
    }

    const cfg = statusConfig[status];

    return (
        <LinearGradient
            colors={[bg1, bg2]}
            style={{ flex: 1 }}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
        >
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
            {/* Bouton settings */}
            <TouchableOpacity
                onPress={() => drop_ip()}
                className="absolute top-11 left-5 z-40 w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}
            >
                <MaterialCommunityIcons name="web" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            {/* Bouton settings */}
            <TouchableOpacity
                onPress={() => drop_settings()}
                className="absolute top-11 right-5 z-40 w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}
            >
                <MaterialCommunityIcons name="cog-outline" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>

                {/* Titre */}
                <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 6 }}>
                    Authentification
                </Text>
                <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 48, letterSpacing: 0.3 }}>
                    Apetraho eo amin’ny mpamantatra ny rantsantananao
                </Text>

                {/* Icône avec anneaux animés */}
                <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                    {/* Anneau externe */}
                    <MotiView
                        from={{ scale: 1, opacity: 0.4 }}
                        animate={{ scale: 1.15, opacity: 0 }}
                        transition={{ loop: true, type: "timing", duration: 2000 }}
                        style={{
                            position: "absolute",
                            width: 140, height: 140, borderRadius: 70,
                            borderWidth: 1.5, borderColor: cfg.ringColor,
                        }}
                    />
                    {/* Anneau interne */}
                    <MotiView
                        from={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.08, opacity: 0 }}
                        transition={{ loop: true, type: "timing", duration: 2000, delay: 400 }}
                        style={{
                            position: "absolute",
                            width: 120, height: 120, borderRadius: 60,
                            borderWidth: 1, borderColor: cfg.ringColor,
                        }}
                    />

                    {/* Cercle principal */}
                    <MotiView
                        animate={{ borderColor: cfg.ringColor }}
                        transition={{ type: "timing", duration: 400 }}
                        style={{
                            width: 110, height: 110, borderRadius: 55,
                            backgroundColor: "rgba(255,255,255,0.07)",
                            borderWidth: 1.5,
                            alignItems: "center", justifyContent: "center",
                            shadowColor: cfg.ringColor,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 1, shadowRadius: 20, elevation: 10,
                        }}
                    >
                        <MaterialCommunityIcons
                            name={
                                status === "waiting" ? "fingerprint" :
                                    status === "success" ? "check-circle-outline" :
                                        "alert-circle-outline"
                            }
                            size={54}
                            color={cfg.color}
                        />
                    </MotiView>
                </View>

                {/* Points de pulsation (waiting only) */}
                {status === "waiting" && (
                    <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
                        {[0, 1, 2].map((i) => (
                            <MotiView
                                key={i}
                                from={{ opacity: 0.2 }}
                                animate={{ opacity: 1 }}
                                transition={{ loop: true, type: "timing", duration: 700, delay: i * 200 }}
                                style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.5)" }}
                            />
                        ))}
                    </View>
                )}

                {/* Chip de statut */}
                <MotiView
                    animate={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
                    transition={{ type: "timing", duration: 400 }}
                    style={{
                        borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12,
                        borderWidth: 1, marginBottom: 48,
                    }}
                >
                    <Text style={{ color: cfg.color, fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                        {cfg.text}
                    </Text>
                </MotiView>

                {/* Lien vers login matricule */}
                <TouchableOpacity
                    onPress={() => { send('stop_listening'); router.push('/Login_matricule') }}
                    activeOpacity={0.7}
                    style={{
                        borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
                    }}
                >
                    <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center" }}>
                        Hampiditra matricule →
                    </Text>
                </TouchableOpacity>

            </View>
        </LinearGradient>
    );
}