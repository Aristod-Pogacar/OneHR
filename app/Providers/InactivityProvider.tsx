import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    AppState,
    AppStateStatus,
    View
} from 'react-native';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

export default function InactivityProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);

    const resetTimer = () => {
        // Pas de timer sur la page de login
        if (pathname === '/Login_matricule') {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        // Réinitialiser le timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            router.replace('/Login_matricule');
        }, INACTIVITY_TIMEOUT);
    };

    useEffect(() => {
        resetTimer();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [pathname]);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextState) => {
                const previousState = appStateRef.current;

                appStateRef.current = nextState;

                // Quand l'application revient au premier plan
                if (
                    previousState.match(/inactive|background/) &&
                    nextState === 'active'
                ) {
                    resetTimer();
                }
            },
        );

        return () => {
            subscription.remove();
        };
    }, [pathname]);

    return (
        <View
            style={{ flex: 1 }}
            onTouchStart={resetTimer}
        >
            {children}
        </View>
    );
}