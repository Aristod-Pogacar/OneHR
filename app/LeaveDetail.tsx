import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { LoadingModal } from "./components/LoadingModal";
import api from "./utils/axios";

type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

interface Leave {
    id: string;
    leave_type: string;
    reason: string;
    start_date: string;
    end_date: string;
    duration?: number;
    status: LeaveStatus;
}

async function cancelLeave(id: string): Promise<boolean> {
    try {
        await api.post(`/withdraw`, { leave_id: id }); // ← POST avec leave_id
        return true;
    } catch {
        return false;
    }
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric",
    });

const STATUS_CONFIG: Record<LeaveStatus, { label: string; color: string; border: string; bg: string; icon: string }> = {
    pending: { label: "En attente", color: "#f5c518", border: "rgba(205,160,0,0.4)", bg: "rgba(205,160,0,0.12)", icon: "clock-outline" },
    approved: { label: "Approuvé", color: "#5dfc2a", border: "rgba(39,180,0,0.35)", bg: "rgba(39,180,0,0.1)", icon: "check-circle-outline" },
    rejected: { label: "Refusé", color: "#ff6b6b", border: "rgba(220,50,50,0.35)", bg: "rgba(220,50,50,0.1)", icon: "close-circle-outline" },
    cancelled: { label: "Annulé", color: "rgba(255,255,255,0.35)", border: "rgba(255,255,255,0.12)", bg: "rgba(255,255,255,0.05)", icon: "cancel" },
};

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
    "Permission_AMD": { icon: "calendar-remove", color: "#5dfc2a", bg: "rgba(39,180,0,0.12)", label: "Permission" },
    "Local_Leave_AMD": { icon: "plane", color: "#60a5fa", bg: "rgba(96,165,250,0.12)", label: "Congé annuel" },
    "Indisponibilite_AMD": { icon: "clock-outline", color: "#f5c518", bg: "rgba(205,160,0,0.12)", label: "Indisponibilité" },
    "smia": { icon: "hospital-box-outline", color: "#c084fc", bg: "rgba(192,132,252,0.12)", label: "Service médical" },
    default: { icon: "file-document-outline", color: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.07)", label: "Congé" },
};

const getTypeConfig = (type: string) => TYPE_CONFIG[type] ?? TYPE_CONFIG.default;

// Ligne de détail réutilisable
function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <View style={{
            flexDirection: "row", alignItems: "flex-start",
            paddingVertical: 14,
            borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)",
        }}>
            <View style={{
                width: 38, height: 38, borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.07)",
                alignItems: "center", justifyContent: "center", marginRight: 14, flexShrink: 0,
            }}>
                <MaterialCommunityIcons name={icon as any} size={20} color="rgba(255,255,255,0.5)" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {label}
                </Text>
                <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600", lineHeight: 24 }}>
                    {value}
                </Text>
            </View>
        </View>
    );
}

export default function LeaveDetail() {
    const router = useRouter();
    const { bg1, bg2 } = useGlobal();
    const { leave: leaveParam } = useLocalSearchParams();
    const [leave, setLeave] = useState<Leave>(JSON.parse(leaveParam as string));
    const [loading, setLoading] = useState(false);

    const tc = getTypeConfig(leave.leave_type);
    const sc = STATUS_CONFIG[leave.status];
    // const canCancel = leave.status === "pending";
    const isSameDay = leave.start_date === leave.end_date;

    const handleCancel = () => {
        Alert.alert(
            "Annuler la demande",
            "Êtes-vous sûr de vouloir annuler cette demande ? Cette action est irréversible.",
            [
                { text: "Non", style: "cancel" },
                {
                    text: "Oui, annuler",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        const ok = await cancelLeave(leave.id);
                        setLoading(false);
                        if (ok) {
                            setLeave((prev) => ({ ...prev, status: "cancelled" }));
                            Alert.alert("Demande annulée", "Votre demande a été annulée avec succès.");
                        } else {
                            Alert.alert("Erreur", "Impossible d'annuler cette demande. Réessayez.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
            <LoadingModal visible={loading} message="Loading..." />

            <View style={{ flex: 1, paddingTop: 48 }}>

                {/* En-tête */}
                <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                    <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
                        Détail
                    </Text>
                    <Text style={{ fontSize: 28, fontWeight: "800", color: "#fff" }}>
                        {tc.label}
                    </Text>
                    <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
                </View>

                {/* Carte statut */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 120 }}
                    style={{ paddingHorizontal: 24, marginBottom: 20 }}
                >
                    <View style={{
                        backgroundColor: sc.bg, borderWidth: 1, borderColor: sc.border,
                        borderRadius: 16, padding: 18,
                        flexDirection: "row", alignItems: "center", gap: 14,
                    }}>
                        <View style={{
                            width: 52, height: 52, borderRadius: 26,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <MaterialCommunityIcons name={sc.icon as any} size={28} color={sc.color} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 13, color: sc.color, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                                Statut actuel
                            </Text>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: sc.color }}>
                                {sc.label}
                            </Text>
                        </View>
                    </View>
                </MotiView>

                {/* Détails */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 120, delay: 80 }}
                    style={{
                        marginHorizontal: 24,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: 16, paddingHorizontal: 16,
                        marginBottom: 20,
                    }}
                >
                    <DetailRow
                        icon="text-box-outline"
                        label="Motif"
                        value={leave.reason || leave.leave_type}
                    />
                    <DetailRow
                        icon="calendar-start"
                        label="Début"
                        value={formatDate(leave.start_date)}
                    />
                    {!isSameDay && (
                        <DetailRow
                            icon="calendar-end"
                            label="Fin"
                            value={formatDate(leave.end_date)}
                        />
                    )}
                    {leave.duration && (
                        <DetailRow
                            icon="weather-night"
                            label="Durée"
                            value={`${leave.duration} jour${leave.duration > 1 ? "s" : ""}`}
                        />
                    )}
                    <DetailRow
                        icon="identifier"
                        label="Référence"
                        value={`#${leave.id}`}
                    />
                </MotiView>

                {/* Spacer */}
                <View style={{ flex: 1 }} />

                {/* Actions */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 120, delay: 160 }}
                    style={{ paddingHorizontal: 24, paddingBottom: 32, gap: 10 }}
                >
                    {/* Bouton Annuler — visible seulement si pending */}
                    {/* {canCancel && ( */}
                    <TouchableOpacity
                        onPress={handleCancel}
                        activeOpacity={0.85}
                        style={{
                            backgroundColor: "rgba(220,50,50,0.15)",
                            borderRadius: 14, paddingVertical: 16,
                            alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10,
                            borderWidth: 1, borderColor: "rgba(220,50,50,0.4)",
                        }}
                    >
                        <MaterialCommunityIcons name="close-circle-outline" size={22} color="#ff6b6b" />
                        <Text style={{ color: "#ff6b6b", fontWeight: "700", fontSize: 18 }}>
                            Annuler la demande
                        </Text>
                    </TouchableOpacity>
                    {/* // )} */}

                    {/* Bouton retour */}
                    <TouchableOpacity
                        onPress={() => router.back()} activeOpacity={0.7}
                        style={{
                            borderRadius: 14, paddingVertical: 14, alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.06)",
                            borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
                        }}
                    >
                        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 17 }}>← Hiverina</Text>
                    </TouchableOpacity>
                </MotiView>

            </View>
        </LinearGradient>
    );
}