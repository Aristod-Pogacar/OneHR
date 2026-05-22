import { useCallback, useEffect, useRef } from 'react';

const WS_URL = 'ws://192.168.137.1:3000';
type Handler = (data: any) => void;

export function useSocket(handlers: Record<string, Handler>) {
    const ws = useRef<WebSocket | null>(null);
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    useEffect(() => {
        const socket = new WebSocket(WS_URL);
        ws.current = socket;

        socket.onopen = () => {
            socket.send(JSON.stringify({ event: 'identify', data: { type: 'expo' } }));
        };

        socket.onmessage = (e) => {
            try {
                const { event, data } = JSON.parse(e.data);
                handlersRef.current[event]?.(data);
            } catch { }
        };

        return () => socket.close();
    }, []);

    const send = useCallback((event: string, data: object = {}) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ event, data }));
        }
    }, []);

    return { send };
}