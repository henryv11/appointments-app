import { useEffect, useRef } from 'react';
import { useInterval } from './interval';

export function useWebSocket({
  url,
  onmessage,
  pingInterval,
  onclose = null,
  onerror = null,
  onopen = null,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket>();
  const intervalRef = useRef<NodeJS.Timeout>();

  function close() {
    wsRef.current?.close();
    wsRef.current = undefined;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function send(data: Parameters<WebSocket['send']>[0]) {
    wsRef.current?.send(data);
  }

  useEffect(() => {
    const ws = new WebSocket(url);

    if (wsRef.current) {
      ws.onmessage = wsRef.current.onmessage;
      ws.onerror = wsRef.current.onerror;
      ws.onclose = wsRef.current.onclose;
      ws.onopen = wsRef.current.onopen;
      close();
    }

    wsRef.current = ws;
    return close;
  }, [url]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pingInterval) intervalRef.current = useInterval(() => send('ping'), pingInterval);
  }, [pingInterval]);

  useEffect(() => {
    if (wsRef.current) wsRef.current.onmessage = onmessage;
  }, [onmessage]);

  useEffect(() => {
    if (wsRef.current) wsRef.current.onerror = onerror;
  }, [onerror]);

  useEffect(() => {
    if (wsRef.current) wsRef.current.onclose = onclose;
  }, [onclose]);

  useEffect(() => {
    if (wsRef.current) wsRef.current.onopen = onopen;
  }, [onopen]);

  return {
    close,
    send,
  };
}

interface UseWebSocketOptions extends Partial<Required<Pick<WebSocket, 'onerror' | 'onclose' | 'onopen'>>> {
  url: string;
  pingInterval?: number;
  onmessage: NonNullable<WebSocket['onmessage']>;
}
