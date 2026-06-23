import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type HourSelectorProps = {
  onChange?: (hour: number, minute: number) => void;
  defaultHour?: number;
  defaultMinute?: number;
  minHour?: number;
  maxHour?: number;
};

const today = new Date();
today.setSeconds(0);
today.setMilliseconds(0);
const arrondirAuMultipleDe5 = (n: number) => Math.ceil(n / 5) * 5;
var defaultMin = arrondirAuMultipleDe5(today.getMinutes());
var defaultHr = today.getHours();
if (defaultMin === 60) { defaultMin = 0; defaultHr++; }

const ArrowButton = ({ onPress, direction }: { onPress: () => void; direction: "up" | "down" }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      width: 64, height: 48, borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
      alignItems: "center", justifyContent: "center",
    }}
  >
    <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, fontWeight: "700" }}>
      {direction === "up" ? "▲" : "▼"}
    </Text>
  </TouchableOpacity>
);

export default function HourSelector({ onChange, defaultHour = defaultHr, defaultMinute = defaultMin, minHour = 8, maxHour = 16 }: HourSelectorProps) {
  const [hour, setHour] = useState<number>(defaultHour);
  const [minute, setMinute] = useState<number>(defaultMinute);

  const increaseHour = () => { if (hour < maxHour) { const n = hour + 1; setHour(n); onChange?.(n, minute); } };
  const decreaseHour = () => { if (hour > minHour) { const n = hour - 1; setHour(n); onChange?.(n, minute); } };
  const increaseMinute = () => { const n = (minute + 5) % 60; setMinute(n); onChange?.(hour, n); };
  const decreaseMinute = () => { const n = (minute - 5 + 60) % 60; setMinute(n); onChange?.(hour, n); };

  const colStyle = {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.13)",
    borderRadius: 16, padding: 14,
    alignItems: "center" as const, gap: 10,
  };

  const labelStyle = {
    fontSize: 10, color: "rgba(255,255,255,0.35)",
    letterSpacing: 1.5, textTransform: "uppercase" as const,
    fontWeight: "600" as const, marginBottom: 2,
  };

  const valueStyle = {
    fontSize: 42, fontWeight: "800" as const, color: "#fff",
    textAlign: "center" as const, paddingVertical: 6,
    minWidth: 90,
    textShadowColor: "rgba(100,140,255,0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {/* Heures */}
      <View style={colStyle}>
        <Text style={labelStyle}>Heure</Text>
        <ArrowButton onPress={increaseHour} direction="up" />
        <Text style={valueStyle}>{hour.toString().padStart(2, "0")}</Text>
        <ArrowButton onPress={decreaseHour} direction="down" />
      </View>

      {/* Séparateur */}
      <Text style={{
        fontSize: 42, fontWeight: "800", color: "rgba(255,255,255,0.3)",
        marginTop: 20,
        textShadowColor: "rgba(100,140,255,0.3)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      }}>:</Text>

      {/* Minutes */}
      <View style={colStyle}>
        <Text style={labelStyle}>Minute</Text>
        <ArrowButton onPress={increaseMinute} direction="up" />
        <Text style={valueStyle}>{minute.toString().padStart(2, "0")}</Text>
        <ArrowButton onPress={decreaseMinute} direction="down" />
      </View>
    </View>
  );
}