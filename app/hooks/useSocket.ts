import { useCallback, useEffect, useRef, useState } from 'react';

const backendURL = process.env.EXPO_PUBLIC_B_LEAVE_URL;

const WS_URL = backendURL?.replace('https', 'wss') || '';

type Handler = (data: any) => void;

export function useSocket(handlers: Record<string, Handler>) {
    const ws = useRef<WebSocket | null>(null);

    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    const [connected, setConnected] = useState(false);

    // Timer de reconnexion
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Permet de savoir si le composant existe encore
    const isUnmounted = useRef(false);

    // Permet d'éviter plusieurs connexions simultanées
    const isConnecting = useRef(false);

    const connect = useCallback(() => {
        if (isUnmounted.current) {
            return;
        }

        // Déjà connecté
        if (
            ws.current &&
            (
                ws.current.readyState === WebSocket.OPEN ||
                ws.current.readyState === WebSocket.CONNECTING
            )
        ) {
            return;
        }

        if (isConnecting.current) {
            return;
        }

        isConnecting.current = true;

        console.log('[WS] Connecting...');

        const socket = new WebSocket(WS_URL);

        ws.current = socket;

        socket.onopen = () => {
            if (isUnmounted.current) {
                socket.close();
                return;
            }

            console.log('[WS] CONNECTED');

            isConnecting.current = false;
            setConnected(true);

            // Identification après connexion
            socket.send(
                JSON.stringify({
                    event: 'identify',
                    data: {
                        type: 'expo',
                    },
                }),
            );

            console.log('[WS] IDENTIFY sent');
        };

        socket.onmessage = (e) => {
            console.log('[WS] MESSAGE:', e.data);

            try {
                const { event, data } = JSON.parse(e.data);

                handlersRef.current[event]?.(data);
            } catch (error) {
                console.error('[WS] Invalid message:', error);
            }
        };

        socket.onerror = (e) => {
            console.error('[WS] ERROR:', e);
        };

        socket.onclose = (e) => {
            console.log('[WS] CLOSED');
            console.log('[WS] code:', e.code);
            console.log('[WS] reason:', e.reason);

            isConnecting.current = false;
            setConnected(false);

            if (ws.current === socket) {
                ws.current = null;
            }

            // Ne pas reconnecter si le composant est démonté
            if (isUnmounted.current) {
                return;
            }

            console.log('[WS] Reconnexion dans 3 secondes...');

            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }

            reconnectTimeout.current = setTimeout(() => {
                reconnectTimeout.current = null;

                console.log('[WS] Tentative de reconnexion...');

                connect();
            }, 3000);
        };
    }, []);

    useEffect(() => {
        isUnmounted.current = false;

        // Première connexion
        connect();

        return () => {
            console.log('[WS] CLEANUP');

            isUnmounted.current = true;

            // Annuler une éventuelle reconnexion
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = null;
            }

            // Fermer le socket
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }

            isConnecting.current = false;
            setConnected(false);
        };
    }, [connect]);

    const send = useCallback(
        (event: string, data: object = {}) => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                console.log('[WS] SEND:', event, data);

                ws.current.send(
                    JSON.stringify({
                        event,
                        data,
                    }),
                );

                return true;
            }

            console.warn(
                '[WS] Cannot send:',
                event,
                'ReadyState:',
                ws.current?.readyState
            );

            return false;
        },
        [],
    );

    return {
        send,
        connected,
    };
}