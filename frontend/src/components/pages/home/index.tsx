import MainLayout from '@/components/layouts/main';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { RoutePath } from '@/lib/constants';
import { useInterval } from '@/lib/react/hooks/interval';
import { useRequireAuthentication } from '@/lib/react/hooks/require-authentication';
import { useWebSocket } from '@/lib/react/hooks/web-socket';
import { getServiceWebSocketUrl } from '@/lib/services';
import { stringify } from 'querystring';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function HomePage() {
  const { push } = useHistory();
  const authState = useRequireAuthentication({ onNotAuthenticated: () => push(RoutePath.LOGIN) });
  const [url, pingInterval] = authState.isAuthenticated
    ? [getServiceWebSocketUrl('?' + stringify({ token: authState.token })), 5000]
    : [undefined, 0];
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
