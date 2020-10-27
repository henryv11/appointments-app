import { useEffect, useRef } from 'react';

export function useWebSocket({ url, onmessage }: WebSocketOptions) {
  const ws = useRef<WebSocket>();

  function close() {
    ws.current?.close();
    ws.current = undefined;
  }

  function send(data: Parameters<WebSocket['send']>[0]) {
    ws.current?.send(data);
  }

  const onclose: WebSocket['onclose'] = function () {};

  const onerror: WebSocket['onerror'] = function () {};

  const onopen: WebSocket['onopen'] = function () {};

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(url);
      ws.current.onmessage = onmessage;
      ws.current.onclose = onclose;
      ws.current.onerror = onerror;
      ws.current.onopen = onopen;
    }

    return close;
  }, []);

  return {
    close,
    send,
  };
}

interface WebSocketOptions {
  url: string;
  onmessage: WebSocket['onmessage'];
}
