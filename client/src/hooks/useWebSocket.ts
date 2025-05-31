import { useEffect, useRef, useState } from "react";

export function useWebSocket(userId: number, streamId: number) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      // Authenticate the connection
      ws.current?.send(JSON.stringify({
        type: 'auth',
        userId,
        streamId
      }));
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle incoming messages (chat, bet updates, etc.)
        console.log('WebSocket message:', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [userId, streamId]);

  const sendMessage = (type: string, data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, ...data }));
    }
  };

  return { isConnected, sendMessage };
}
