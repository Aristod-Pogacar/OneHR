import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type DateSelectorProps = {
  onChange?: (date: Date) => void;
  defaultValue?: Date;
};

const ArrowButton = ({ onPress, direction }: { onPress: () => void; direction: "up" | "down" }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      width: 52, height: 42, borderRadius: 10,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
      alignItems: "center", justifyContent: "center",
    }}
  >
    <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: "700" }}>
      {direction === "up" ? "▲" : "▼"}
    </Text>
  </TouchableOpacity>
);

export default function DateSelector({ onChange, defaultValue = new Date() }: DateSelectorProps) {
  const [day, setDay] = useState(defaultValue.getDate());
  const [month, setMonth] = useState(defaultValue.getMonth() + 1);
  const [year, setYear] = useState(defaultValue.getFullYear());

  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

  const adjustDayForMonth = (d: number, m: number, y: number) => Math.min(d, new Date(y, m, 0).getDate());

  const updateDate = (d: number, m: number, y: number) => {
    onChange?.(new Date(y, m - 1, d));
  };

  const incrementDay = () => { const n = day < new Date(year, month, 0).getDate() ? day + 1 : 1; setDay(n); updateDate(n, month, year); };
  const decrementDay = () => { const n = day > 1 ? day - 1 : new Date(year, month, 0).getDate(); setDay(n); updateDate(n, month, year); };
  const incrementMonth = () => { const n = month < 12 ? month + 1 : 1; setMonth(n); const d = adjustDayForMonth(day, n, year); setDay(d); updateDate(d, n, year); };
  const decrementMonth = () => { const n = month > 1 ? month - 1 : 12; setMonth(n); const d = adjustDayForMonth(day, n, year); setDay(d); updateDate(d, n, year); };
  const incrementYear = () => { const n = year + 1; setYear(n); const d = adjustDayForMonth(day, month, n); setDay(d); updateDate(d, month, n); };
  const decrementYear = () => { const n = year - 1; setYear(n); const d = adjustDayForMonth(day, month, n); setDay(d); updateDate(d, month, n); };

  const colStyle = {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.13)",
    borderRadius: 16, padding: 12,
    alignItems: "center" as const, gap: 8,
  };

  const labelStyle = {
    fontSize: 10, color: "rgba(255,255,255,0.35)",
    letterSpacing: 1.5, textTransform: "uppercase" as const,
    fontWeight: "600" as const, marginBottom: 2,
  };

  const valueStyle = {
    fontSize: 28, fontWeight: "800" as const, color: "#fff",
    textAlign: "center" as const, paddingVertical: 8,
    textShadowColor: "rgba(100,140,255,0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
      {/* Jour */}
      <View style={colStyle}>
        <Text style={labelStyle}>Jour</Text>
        <ArrowButton onPress={incrementDay} direction="up" />
        <Text style={{ ...valueStyle, minWidth: 50 }}>{day}</Text>
        <ArrowButton onPress={decrementDay} direction="down" />
      </View>

      {/* Mois */}
      <View style={colStyle}>
        <Text style={labelStyle}>Mois</Text>
        <ArrowButton onPress={incrementMonth} direction="up" />
        <Text style={{ ...valueStyle, fontSize: 30, minWidth: 80 }}>{monthNames[month - 1]}</Text>
        <ArrowButton onPress={decrementMonth} direction="down" />
      </View>

      {/* Année */}
      <View style={colStyle}>
        <Text style={labelStyle}>Année</Text>
        <ArrowButton onPress={incrementYear} direction="up" />
        <Text style={{ ...valueStyle, minWidth: 70 }}>{year}</Text>
        <ArrowButton onPress={decrementYear} direction="down" />
      </View>
    </View>
  );
}