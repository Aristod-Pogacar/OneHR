import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
    days?: number;
}

async function fetchHistory(matricule: string, ipAddress: string) {
    try {
        console.log("FETCHING...");

        const url =
            'http://' +
            ipAddress +
            ':' +
            process.env.EXPO_PUBLIC_PORT +
            `/api/leave/history/${matricule}`;

        console.log("URL:", url);

        const response = await axios.get(url, {
            timeout: 10000,
        });

        console.log("OK");
        console.log("RESPONSE:", response.data);

        return response.data;
    } catch (error) {
        console.log("FETCH ERROR:", error);
        return [];
    }
}

async function cancelLeave(id: string): Promise<boolean> {
    try {
        await api.patch(`/api/leave/${id}/cancel`);
        return true;
    } catch {
        return false;
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const diffDays = (start: string, end: string) => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

const STATUS_CONFIG: Record<LeaveStatus, { label: string; bg: string; color: string; border: string }> = {
    pending: { label: "pending", bg: "rgba(205,160,0,0.15)", color: "#f5c518", border: "rgba(205,160,0,0.4)" },
    approved: { label: "approved", bg: "rgba(39,180,0,0.12)", color: "#5dfc2a", border: "rgba(39,180,0,0.35)" },
    rejected: { label: "rejected", bg: "rgba(220,50,50,0.12)", color: "#ff6b6b", border: "rgba(220,50,50,0.35)" },
    cancelled: { label: "cancelled", bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)", border: "rgba(255,255,255,0.12)" },
};

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
    "Permission_AMD": { icon: "calendar-remove", color: "#5dfc2a", bg: "rgba(39,180,0,0.12)" },
    "Local_Leave_AMD": { icon: "plane", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
    "Indisponibilite_AMD": { icon: "clock-outline", color: "#f5c518", bg: "rgba(205,160,0,0.12)" },
    "smia": { icon: "hospital-box-outline", color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
    default: { icon: "file-document-outline", color: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.07)" },
};

const getTypeConfig = (type: string) => TYPE_CONFIG[type] ?? TYPE_CONFIG.default;

// ── Composant carte ───────────────────────────────────────────────────────────

function LeaveCard({ leave, onCancel }: { leave: Leave; onCancel: (id: string) => void }) {
    const tc = getTypeConfig(leave.leave_type);
    const sc = STATUS_CONFIG[leave.status];
    const canCancel = leave.status === "pending";
    const days = leave.duration;
    const isSameDay = leave.start_date === leave.end_date;


    return (
        <View style={{
            backgroundColor: "rgba(255,255,255,0.07)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
            borderRadius: 16, padding: 16, marginBottom: 10,
        }}>
            {/* Ligne haute */}
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                {/* Icône */}
                <View style={{
                    width: 42, height: 42, borderRadius: 12,
                    backgroundColor: tc.bg,
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                    <MaterialCommunityIcons name={tc.icon as any} size={22} color={tc.color} />
                </View>

                {/* Titre + dates */}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff", marginBottom: 4 }} numberOfLines={1}>
                        {leave.reason || leave.leave_type}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialCommunityIcons name="calendar-outline" size={12} color="rgba(255,255,255,0.4)" />
                        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                            {isSameDay
                                ? formatDate(leave.start_date)
                                : `${formatDate(leave.start_date)} → ${formatDate(leave.end_date)}`}
                        </Text>
                    </View>
                </View>

                {/* Badge statut */}
                <View style={{
                    backgroundColor: sc.bg, borderWidth: 1, borderColor: sc.border,
                    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 0,
                }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: sc.color }}>{sc.label}</Text>
                </View>
            </View>

            {/* Ligne basse */}
            <View style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)",
            }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <MaterialCommunityIcons name="weather-night" size={13} color="rgba(255,255,255,0.35)" />
                    <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        {isSameDay ? "1 jour" : `${days} jours`}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => canCancel && onCancel(leave.id)}
                    disabled={!canCancel}
                    activeOpacity={0.7}
                    style={{
                        flexDirection: "row", alignItems: "center", gap: 4,
                        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
                        backgroundColor: canCancel ? "rgba(220,50,50,0.12)" : "transparent",
                        borderWidth: 1,
                        borderColor: canCancel ? "rgba(220,50,50,0.35)" : "rgba(255,255,255,0.1)",
                        opacity: canCancel ? 1 : 0.35,
                    }}
                >
                    <MaterialCommunityIcons
                        name="close-circle-outline" size={14}
                        color={canCancel ? "#ff6b6b" : "rgba(255,255,255,0.4)"}
                    />
                    <Text style={{
                        fontSize: 12, fontWeight: "600",
                        color: canCancel ? "#ff6b6b" : "rgba(255,255,255,0.4)",
                    }}>
                        Annuler
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ── Écran principal ───────────────────────────────────────────────────────────

export default function LeaveHistory() {
    const router = useRouter();
    const { bg1, bg2, loggedUSer, ipAddress } = useGlobal();

    console.log("loggedUSer:", loggedUSer.matricule);

    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loggedUSer == null) {
            router.replace("/Login_matricule");
            return;
        }
        const fetchData = async () => {
            try {
                const data = await fetchHistory(loggedUSer.matricule, ipAddress);
                console.log("data:", data);
                setLeaves(data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'historique :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [loggedUSer]);

    if (loggedUSer == null) return null;

    // Statistiques
    const total = leaves.length;
    const approved = leaves.filter((l) => l.status === "approved").length;
    const pending = leaves.filter((l) => l.status === "pending").length;

    const handleCancel = (id: string) => {
        Alert.alert(
            "Annuler le congé",
            "Êtes-vous sûr de vouloir annuler cette demande ?",
            [
                { text: "Non", style: "cancel" },
                {
                    text: "Oui, annuler",
                    style: "destructive",
                    onPress: async () => {
                        const ok = await cancelLeave(id);
                        if (ok) {
                            setLeaves((prev) =>
                                prev.map((l) => l.id === id ? { ...l, status: "cancelled" } : l)
                            );
                        } else {
                            Alert.alert("Erreur", "Impossible d'annuler cette demande.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <LinearGradient
            colors={[bg1, bg2]}
            style={{ flex: 1 }}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
        >
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
            <LoadingModal visible={loading} message="Loading..." />

            {/* En-tête */}
            <View style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <View>
                        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
                            {loggedUSer.fullname}
                        </Text>
                        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
                            Historique des congés
                        </Text>
                    </View>
                    <View style={{
                        backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.13)", borderRadius: 10,
                        paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row", alignItems: "center", gap: 6,
                    }}>
                        <MaterialCommunityIcons name="calendar" size={14} color="rgba(255,255,255,0.5)" />
                        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                            {new Date().getFullYear()}
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={{ flexDirection: "row", gap: 10, marginTop: 20, marginBottom: 4 }}>
                    {[
                        { label: "Total", value: total, color: "#fff" },
                        { label: "Approuvés", value: approved, color: "#5dfc2a" },
                        { label: "En attente", value: pending, color: "#f5c518" },
                    ].map((s) => (
                        <View key={s.label} style={{
                            flex: 1, backgroundColor: "rgba(255,255,255,0.07)",
                            borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
                            borderRadius: 12, padding: 12, alignItems: "center",
                        }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: s.color, marginBottom: 2 }}>{s.value}</Text>
                            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
            </View>

            {/* Liste */}
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                {!loading && leaves.length === 0 ? (
                    <View style={{ alignItems: "center", paddingTop: 60 }}>
                        <MaterialCommunityIcons name="calendar-blank-outline" size={48} color="rgba(255,255,255,0.15)" />
                        <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginTop: 12 }}>
                            Aucun congé cette année
                        </Text>
                    </View>
                ) : (
                    leaves.map((leave) => (
                        <LeaveCard key={leave.id} leave={leave} onCancel={handleCancel} />
                    ))
                )}
            </ScrollView>

            {/* Bouton retour */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 24, marginTop: 24 }}>
                <TouchableOpacity
                    onPress={() => router.back()} activeOpacity={0.7}
                    style={{
                        borderRadius: 14, paddingVertical: 12, alignItems: "center",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
                    }}
                >
                    <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>← Hiverina</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}