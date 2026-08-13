import { useCallback, useEffect, useRef, useState } from 'react';

const backendURL = process.env.EXPO_PUBLIC_B_LEAVE_URL;
const WS_URL = backendURL?.replace('https', 'wss') || "";
//const WS_URL = 'wss://b-leave.up.railway.app';

type Handler = (data: any) => void;

export function useSocket(handlers: Record<string, Handler>) {
    const ws = useRef<WebSocket | null>(null);

    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        console.log('[WS] Connecting...');

        const socket = new WebSocket(WS_URL);

        ws.current = socket;

        socket.onopen = () => {
            console.log('[WS] CONNECTED');

            setConnected(true);

            // Identification uniquement après connexion
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

            setConnected(false);

            if (ws.current === socket) {
                ws.current = null;
            }
        };

        return () => {
            console.log('[WS] CLEANUP');

            socket.close();

            if (ws.current === socket) {
                ws.current = null;
            }

            setConnected(false);
        };
    }, []);

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