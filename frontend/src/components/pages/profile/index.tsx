import RequireAuthentication from '@/components/higher-order/require-authentication';
import MainLayout from '@/components/layouts/main';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { useAuthContext } from '@/contexts/auth';
import { useInterval } from '@/lib/react/hooks/interval';
import { useWebSocket } from '@/lib/react/hooks/web-socket';
import { getServiceWebSocketUrl } from '@/lib/services';
import { stringify } from 'querystring';
import React from 'react';

export default function ProfilePage() {
  const [authState] = useAuthContext();
  const ws = useWebSocket({
    url: authState.isAuthenticated ? getServiceWebSocketUrl('?' + stringify({ token: authState.token })) : undefined,
    onmessage: ev => console.log('on websocket message', ev),
    onerror: ev => console.log('on websocket error', ev),
    onopen: ev => (console.log('websocket open', ev), ws.send('hello')),
  });
  useInterval(() => ws.send('ping'), 5000);
  return (
    <RequireAuthentication>
      <MainLayout>
        <Breadcrumbs />
        Profile page
      </MainLayout>
    </RequireAuthentication>
  );
}
