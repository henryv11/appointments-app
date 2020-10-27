import { useEffect, useRef } from 'react';

export function useWebSocket({
  url,
  onmessage = null,
  onclose = null,
  onerror = null,
  onopen = null,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket>();
  const onmessageRef = useRef(onmessage);
  const oncloseRef = useRef(onclose);
  const onerrorRef = useRef(onerror);
  const onopenRef = useRef(onopen);

  function close() {
    wsRef.current?.close();
    wsRef.current = undefined;
  }

  function send(...data: Parameters<WebSocket['send']>) {
    wsRef.current?.send(...data);
  }

  useEffect(() => {
    if (!url) return;
    const ws = new WebSocket(url);
    ws.onopen = ev => onopenRef.current?.call(ws, ev);
    ws.onmessage = ev => onmessageRef.current?.call(ws, ev);
    ws.onclose = ev => oncloseRef.current?.call(ws, ev);
    ws.onerror = ev => onerrorRef.current?.call(ws, ev);
    wsRef.current = ws;
    return close;
  }, [url]);

  useEffect(() => {
    onmessageRef.current = onmessage;
  }, [onmessage]);

  useEffect(() => {
    onerrorRef.current = onerror;
  }, [onerror]);

  useEffect(() => {
    oncloseRef.current = onclose;
  }, [onclose]);

  useEffect(() => {
    onopenRef.current = onopen;
  }, [onopen]);

  return {
    close,
    send,
  };
}

interface UseWebSocketOptions
  extends Partial<Required<Pick<WebSocket, 'onmessage' | 'onerror' | 'onclose' | 'onopen'>>> {
  url?: string;
}
