import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { LoadingModal } from "./components/LoadingModal";

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

async function fetchHistory(matricule: string, ipAddress: string): Promise<Leave[]> {
    try {
        const url = `http://${ipAddress}:${process.env.EXPO_PUBLIC_PORT}/api/leave/history/${matricule}`;
        const response = await axios.get(url, { timeout: 10000 });
        return response.data;
    } catch {
        return [];
    }
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const STATUS_CONFIG: Record<LeaveStatus, { label: string; color: string; border: string; bg: string }> = {
    pending: { label: "En attente", color: "#f5c518", border: "rgba(205,160,0,0.4)", bg: "rgba(205,160,0,0.12)" },
    approved: { label: "Approuvé", color: "#5dfc2a", border: "rgba(39,180,0,0.35)", bg: "rgba(39,180,0,0.1)" },
    rejected: { label: "Refusé", color: "#ff6b6b", border: "rgba(220,50,50,0.35)", bg: "rgba(220,50,50,0.1)" },
    cancelled: { label: "Annulé", color: "rgba(255,255,255,0.35)", border: "rgba(255,255,255,0.12)", bg: "rgba(255,255,255,0.05)" },
};

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
    "Permission_AMD": { icon: "calendar-remove", color: "#5dfc2a", bg: "rgba(39,180,0,0.12)" },
    "Local_Leave_AMD": { icon: "calendar", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
    "Indisponibilite_AMD": { icon: "clock-outline", color: "#ff0000ff", bg: "rgba(205,160,0,0.12)" },
    "smia": { icon: "hospital-box-outline", color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
    default: { icon: "file-document-outline", color: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.07)" },
};

const getTypeConfig = (type: string) => TYPE_CONFIG[type] ?? TYPE_CONFIG.default;

function LeaveCard({ leave, onPress }: { leave: Leave; onPress: () => void }) {
    const tc = getTypeConfig(leave.leave_type);
    const sc = STATUS_CONFIG[leave.status];
    const isSameDay = leave.start_date === leave.end_date;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.75}
            style={{
                backgroundColor: "rgba(255,255,255,0.07)",
                borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
                borderRadius: 18, padding: 18, marginBottom: 12,
                flexDirection: "row", alignItems: "center", gap: 16,
            }}
        >
            {/* Icône */}
            <View style={{
                width: 52, height: 52, borderRadius: 14,
                backgroundColor: tc.bg, alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
                <MaterialCommunityIcons name={tc.icon as any} size={26} color={tc.color} />
            </View>

            {/* Contenu */}
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 5 }} numberOfLines={1}>
                    {leave.reason || leave.leave_type}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <MaterialCommunityIcons name="calendar-outline" size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.45)" }}>
                        {isSameDay
                            ? formatDate(leave.start_date)
                            : `${formatDate(leave.start_date)} → ${formatDate(leave.end_date)}`}
                    </Text>
                </View>
                {leave.duration && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                        <MaterialCommunityIcons name="weather-night" size={14} color="rgba(255,255,255,0.3)" />
                        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>
                            {leave.duration} andro
                        </Text>
                    </View>
                )}
            </View>

            {/* Badge + chevron */}
            <View style={{ alignItems: "flex-end", gap: 8 }}>
                <View style={{
                    backgroundColor: sc.bg, borderWidth: 1, borderColor: sc.border,
                    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
                }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: sc.color }}>{sc.label}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.25)" />
            </View>
        </TouchableOpacity>
    );
}

export default function LeaveHistory() {
    const router = useRouter();
    const { bg1, bg2, loggedUSer, ipAddress } = useGlobal();
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loggedUSer == null) { router.replace("/Login_matricule"); return; }
        fetchHistory(loggedUSer.matricule, ipAddress).then((data) => {
            setLeaves(data);
            setLoading(false);
        });
    }, [loggedUSer]);

    if (loggedUSer == null) return null;

    const total = leaves.length;
    const approved = leaves.filter((l) => l.status === "approved").length;
    const pending = leaves.filter((l) => l.status === "pending").length;

    return (
        <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
            <LoadingModal visible={loading} message="Loading..." />

            {/* En-tête */}
            <View style={{ paddingTop: 48, paddingHorizontal: 24 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <View>
                        <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
                            {loggedUSer.fullname}
                        </Text>
                        <Text style={{ fontSize: 28, fontWeight: "800", color: "#fff" }}>
                            Lisitry ny tsy fiasana nangatahinao
                        </Text>
                    </View>
                    <View style={{
                        backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.13)", borderRadius: 10,
                        paddingHorizontal: 14, paddingVertical: 8,
                        flexDirection: "row", alignItems: "center", gap: 6,
                    }}>
                        <MaterialCommunityIcons name="calendar" size={16} color="rgba(255,255,255,0.5)" />
                        <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>
                            {new Date().getFullYear()}
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                    {[
                        { label: "Totaly", value: total, color: "#fff" },
                        { label: "Nekena", value: approved, color: "#5dfc2a" },
                        { label: "Mbola miandry", value: pending, color: "#f5c518" },
                    ].map((s) => (
                        <View key={s.label} style={{
                            flex: 1, backgroundColor: "rgba(255,255,255,0.07)",
                            borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
                            borderRadius: 12, padding: 14, alignItems: "center",
                        }}>
                            <Text style={{ fontSize: 28, fontWeight: "800", color: s.color, marginBottom: 2 }}>{s.value}</Text>
                            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
            </View>

            {/* Liste */}
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                {!loading && leaves.length === 0 ? (
                    <View style={{ alignItems: "center", paddingTop: 60 }}>
                        <MaterialCommunityIcons name="calendar-blank-outline" size={56} color="rgba(255,255,255,0.15)" />
                        <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 17, marginTop: 16 }}>
                            Aucun congé cette année
                        </Text>
                    </View>
                ) : (
                    leaves.map((leave) => (
                        <LeaveCard
                            key={leave.id}
                            leave={leave}
                            onPress={() => router.push({
                                pathname: "/LeaveDetail",
                                params: { leave: JSON.stringify(leave) },
                            })}
                        />
                    ))
                )}
            </ScrollView>

            {/* Bouton retour */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
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
            </View>
        </LinearGradient>
    );
}