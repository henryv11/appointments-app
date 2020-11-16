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
  const [url, pingInterval] = authState.isAuthenticated
    ? [getServiceWebSocketUrl('?' + stringify({ token: authState.token })), 5000]
    : [];
  const { send } = useWebSocket({
    url,
    onmessage: ev => console.log('on websocket message', ev),
    onerror: ev => console.log('on websocket error', ev),
    onopen: ev => console.log('websocket open', ev),
  });

  useInterval(() => send('ping'), pingInterval);

  return (
    <MainLayout>
      <Breadcrumbs />
      Profile page
    </MainLayout>
  );
}
