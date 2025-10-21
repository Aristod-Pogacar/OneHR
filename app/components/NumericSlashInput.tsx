import React, { useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";

export default function NumericSlashInput({
  value,
  onChange,
  placeholder = "JJ/MM/AAAA",
  maxLength,
}: {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const [text, setText] = useState(value ?? "");
  const [error, setError] = useState<string | null>(null);

  // Regex : autorise chiffres, slash '/', backslash '\', plus '+' et moins '-'
  // Note : le backslash doit être échappé dans la regex -> \\ 
  const allowedRegex = /^[0-9\/\\+\-]*$/;
  const sanitize = (input: string) => {
    // retire tous les caractères non autorisés
    return input.replace(/[^0-9\/\\+\-]/g, "");
  };

  const handleChange = (input: string) => {
    // sanitize (gère paste aussi)
    const cleaned = sanitize(input);

    // optional : tu peux limiter la longueur
    const truncated = typeof maxLength === "number" ? cleaned.slice(0, maxLength) : cleaned;

    setText(truncated);
    setError(allowedRegex.test(truncated) ? null : "Caractères non autorisés"); // normalement jamais triggeré si sanitize fait son job
    onChange && onChange(truncated);
  };

  // Choix du keyboardType selon plateforme
  // iOS : 'numbers-and-punctuation' propose chiffres + ponctuation
  // Android : 'numeric' ou 'phone-pad' (aucun clavier standard ne garantit \ sur Android)
  const keyboardType = Platform.select({
    ios: "numbers-and-punctuation" as any,
    android: "numeric" as any,
    default: "numeric" as any,
  });

  return (
    <View>
      <TextInput
        value={text}
        onChangeText={handleChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCorrect={false}
        autoCapitalize="none"
        // Empêche la saisie prédictive d'ajouter des lettres
        importantForAutofill="no"
        // showSoftInputOnFocus=false empêche le clavier natif; ici on veut le clavier donc pas activé
        // showSoftInputOnFocus={false}
        selectionColor="#0ea5e9"
        className="border p-3 rounded-md bg-white"
      />
      {error ? <Text className="text-red-600 mt-1">{error}</Text> : null}
    </View>
  );
}
