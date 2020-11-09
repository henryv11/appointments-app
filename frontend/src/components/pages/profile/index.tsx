import MainLayout from '@/components/layouts/main';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { useAuthContext } from '@/contexts/auth';
import { RoutePath } from '@/lib/constants';
import { useInterval } from '@/lib/react/hooks/interval';
import { useRequireAuthentication } from '@/lib/react/hooks/require-authentication';
import { useWebSocket } from '@/lib/react/hooks/web-socket';
import { getServiceWebSocketUrl } from '@/lib/services';
import { stringify } from 'querystring';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function ProfilePage() {
  const [authState] = useAuthContext();
  const { push } = useHistory();
  const { send } = useWebSocket({
    url: authState.isAuthenticated ? getServiceWebSocketUrl('?' + stringify({ token: authState.token })) : undefined,
    onmessage: ev => console.log('on websocket message', ev),
    onerror: ev => console.log('on websocket error', ev),
    onopen: ev => (console.log('websocket open', ev), send('hello')),
  });
  useInterval(() => send('ping'), authState.isAuthenticated ? 5000 : 0);
  useRequireAuthentication({ onNotAuthenticated: () => push(RoutePath.LOGIN) });

  return (
    <MainLayout>
      <Breadcrumbs />
      Profile page
    </MainLayout>
  );
}
