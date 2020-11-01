import RequireAuthentication from '@/components/higher-order/require-authentication';
import MainLayout from '@/components/layouts/main';
import { useInterval } from '@/lib/react/hooks/interval';
import { useWebSocket } from '@/lib/react/hooks/web-socket';
import { getServiceWebSocketUrl } from '@/lib/services';
import React from 'react';

export default function HomePage() {
  const ws = useWebSocket({
    url: getServiceWebSocketUrl(),
    onmessage: ev => console.log('on websocket message', ev),
    onerror: ev => console.log('on websocket error', ev),
    onopen: ev => (console.log('websocket open', ev), ws.send('hello')),
  });

  useInterval(() => ws.send('ping'), 5000);

  return (
    <RequireAuthentication>
      <MainLayout>hello</MainLayout>
    </RequireAuthentication>
  );
}
