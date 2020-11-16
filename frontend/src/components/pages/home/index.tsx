import MainLayout from '@/components/layouts/main';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { useAuthContext } from '@/contexts/auth';
import { useInterval } from '@/lib/react/hooks/interval';
import { useWebSocket } from '@/lib/react/hooks/web-socket';
import { getServiceWebSocketUrl } from '@/lib/services';
import { stringify } from 'querystring';
import React from 'react';

export default function HomePage() {
  const [authState] = useAuthContext();
  const [url, pingInterval] = authState.isAuthenticated
    ? [getServiceWebSocketUrl('?' + stringify({ token: authState.token })), 5000]
    : [];
  const { send } = useWebSocket({
    url,
    onmessage: ev => console.log('on websocket message', ev),
    onerror: ev => console.log('on websocket error', ev),
    onopen: ev => (console.log('websocket open', ev), send('hello')),
  });
  useInterval(() => send('ping'), pingInterval);

  const servers = [{ name: 'blin' }, { name: 'fidget spinner' }];

  return (
    <MainLayout>
      <Breadcrumbs />
      <div>
        {servers.map(server => (
          <div key={server.name}>{server.name}</div>
        ))}
      </div>
    </MainLayout>
  );
}
