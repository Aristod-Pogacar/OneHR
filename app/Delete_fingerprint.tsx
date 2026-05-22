import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGlobal } from './Providers/GlobalProvider';
import { useSocket } from './hooks/useSocket';

type Step = 'form' | 'loading' | 'success' | 'error';

export default function DeleteFingerprint() {
    const { bg1, bg2 } = useGlobal();
    const [matricule, setMatricule] = useState('');
    const [step, setStep] = useState<Step>('form');
    const [message, setMessage] = useState('');

    const { send } = useSocket({
        delete_complete: () => setStep('success'),
        delete_error: (data) => { setMessage(data.message); setStep('error'); },
    });

    const confirmDelete = () => {
        if (!matricule.trim()) return;
        setStep('loading');
        send('delete_fingerprint', { matricule: matricule.trim() });
    };

    const reset = () => {
        setStep('form');
        setMatricule('');
        setMessage('');
    };

    return (
        <LinearGradient
            colors={[bg1, bg2]}
            style={{ flex: 1 }}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>

                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6 }}>
                        Supprimer une empreinte
                    </Text>
                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 48 }}>
                        Saisir le matricule de l'employé
                    </Text>

                    {/* Icône */}
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                        <View style={{
                            width: 110, height: 110, borderRadius: 55,
                            backgroundColor: 'rgba(255,255,255,0.07)',
                            borderWidth: 1.5, borderColor: 'rgba(220,50,50,0.3)',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MaterialCommunityIcons
                                name={
                                    step === 'success' ? 'check-circle-outline' :
                                        step === 'error' ? 'alert-circle-outline' :
                                            'fingerprint-off'
                                }
                                size={54}
                                color={
                                    step === 'success' ? '#5dfc2a' :
                                        step === 'error' ? '#ff6b6b' :
                                            'rgba(255,100,100,0.8)'
                                }
                            />
                        </View>
                    </View>

                    {/* Formulaire */}
                    {step === 'form' && (
                        <View style={{ width: '100%', gap: 12 }}>
                            <TextInput
                                value={matricule}
                                onChangeText={setMatricule}
                                placeholder="Matricule (ex: AMAA9000002356)"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                autoCapitalize="characters"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                                    borderRadius: 14, padding: 16,
                                    color: '#fff', fontSize: 15,
                                }}
                            />
                            <TouchableOpacity
                                onPress={confirmDelete}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: 'rgba(220,50,50,0.3)',
                                    borderRadius: 14, paddingVertical: 16,
                                    alignItems: 'center',
                                    borderWidth: 1, borderColor: 'rgba(220,50,50,0.5)',
                                }}
                            >
                                <Text style={{ color: '#ff6b6b', fontSize: 16, fontWeight: '700' }}>
                                    Supprimer
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.back()}
                                activeOpacity={0.7}
                                style={{
                                    marginTop: 10, borderRadius: 14, paddingVertical: 12, alignItems: "center",
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
                                }}
                            >
                                <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>← Retour</Text>
                            </TouchableOpacity>

                        </View>
                    )}

                    {/* Loading */}
                    {step === 'loading' && (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                borderRadius: 20, paddingHorizontal: 24, paddingVertical: 14,
                                backgroundColor: 'rgba(255,255,255,0.07)',
                                borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)',
                            }}
                        >
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' }}>
                                Suppression en cours...
                            </Text>
                        </MotiView>
                    )}

                    {/* Succès */}
                    {step === 'success' && (
                        <View style={{ alignItems: 'center', gap: 16 }}>
                            <Text style={{ color: '#5dfc2a', fontSize: 16, fontWeight: '700' }}>
                                ✅ Empreinte supprimée
                            </Text>
                            <TouchableOpacity onPress={reset} activeOpacity={0.7}
                                style={{
                                    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24,
                                    backgroundColor: 'rgba(100,140,255,0.35)',
                                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 14 }}>
                                    Supprimer un autre
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.back()}
                                style={{
                                    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24,
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                                }}
                            >
                                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                                    Menu principal
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Erreur */}
                    {step === 'error' && (
                        <View style={{ alignItems: 'center', gap: 16 }}>
                            <Text style={{ color: '#ff6b6b', fontSize: 15, textAlign: 'center' }}>
                                ❌ {message}
                            </Text>
                            <TouchableOpacity onPress={reset} activeOpacity={0.7}
                                style={{
                                    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24,
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                                }}
                            >
                                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Réessayer</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}