import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGlobal } from './Providers/GlobalProvider';
import { useSocket } from './hooks/useSocket';

type Step = 'form' | 'pose1' | 'pose2' | 'success' | 'error';

export default function Enroll() {
    const { bg1, bg2 } = useGlobal();
    const [matricule, setMatricule] = useState('');
    const [step, setStep] = useState<Step>('form');
    const [message, setMessage] = useState('');
    const [employee, setEmployee] = useState<any>(null);

    const { send } = useSocket({
        enroll_step: (data) => {
            if (data.step === 1) setStep('pose2');
        },
        enroll_complete: (data) => {
            setEmployee(data.employee);
            setStep('success');
        },
        enroll_error: (data) => {
            setMessage(data.message);
            setStep('error');
        },
    });

    const startEnroll = () => {
        if (!matricule.trim()) return;
        setStep('pose1');
        send('start_enroll', { matricule: matricule.trim() });
    };

    const reset = () => {
        setStep('form');
        setMatricule('');
        setMessage('');
        setEmployee(null);
    };

    const stepConfig = {
        form: { icon: 'fingerprint', color: 'rgba(255,255,255,0.8)', label: '' },
        pose1: { icon: 'hand-pointing-up', color: '#60a5fa', label: 'Posez le doigt (1ère fois)' },
        pose2: { icon: 'hand-pointing-up', color: '#a78bfa', label: 'Posez le doigt à nouveau' },
        success: { icon: 'check-circle-outline', color: '#5dfc2a', label: `Enregistré: ${employee?.name}` },
        error: { icon: 'alert-circle-outline', color: '#ff6b6b', label: message },
    };

    const cfg = stepConfig[step];

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
                        Enregistrer une empreinte
                    </Text>
                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 48 }}>
                        Associer un matricule à un doigt
                    </Text>

                    {/* Icône animée */}
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                        <MotiView
                            from={{ scale: 1, opacity: 0.4 }}
                            animate={{ scale: 1.15, opacity: 0 }}
                            transition={{ loop: step === 'pose1' || step === 'pose2', type: 'timing', duration: 2000 }}
                            style={{
                                position: 'absolute', width: 140, height: 140, borderRadius: 70,
                                borderWidth: 1.5, borderColor: 'rgba(100,140,255,0.35)',
                            }}
                        />
                        <View style={{
                            width: 110, height: 110, borderRadius: 55,
                            backgroundColor: 'rgba(255,255,255,0.07)',
                            borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MaterialCommunityIcons name={cfg.icon as any} size={54} color={cfg.color} />
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
                                    color: '#fff', fontSize: 15, letterSpacing: 0.5,
                                }}
                            />
                            <TouchableOpacity
                                onPress={startEnroll}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: 'rgba(100,140,255,0.35)',
                                    borderRadius: 14, paddingVertical: 16,
                                    alignItems: 'center',
                                    borderWidth: 1, borderColor: 'rgba(100,140,255,0.5)',
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                                    Commencer
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

                    {/* Statut */}
                    {step !== 'form' && (
                        <MotiView
                            animate={{ opacity: 1 }}
                            from={{ opacity: 0 }}
                            style={{
                                borderRadius: 20, paddingHorizontal: 24, paddingVertical: 14,
                                backgroundColor: 'rgba(255,255,255,0.07)',
                                borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)',
                                marginBottom: 24,
                            }}
                        >
                            <Text style={{ color: cfg.color, fontSize: 15, fontWeight: '600', textAlign: 'center' }}>
                                {cfg.label}
                            </Text>
                        </MotiView>
                    )}

                    {/* Bouton reset après succès/erreur */}
                    {(step === 'success' || step === 'error') && (
                        <View style={{ alignItems: 'center', gap: 16 }}>
                            <TouchableOpacity
                                onPress={reset}
                                activeOpacity={0.7}
                                style={{
                                    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24,
                                    backgroundColor: '#rgba(100,140,255,0.35)',
                                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 14 }}>
                                    {step === 'success' ? 'Enregistrer un autre' : 'Réessayer'}
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

                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}