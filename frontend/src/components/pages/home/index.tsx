import MainLayout from '@/components/layouts/main';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { useAuthContext } from '@/contexts/auth';
import { UserContextProvider } from '@/contexts/user';
import { RoutePath } from '@/lib/constants';
import { useAsync } from '@/lib/react/hooks/async';
import { useInterval } from '@/lib/react/hooks/interval';
import { useWebSocket } from '@/lib/react/hooks/web-socket';
import { getServiceWebSocketUrl } from '@/lib/services';
import { getUserProfile } from '@/services/user';
import { stringify } from 'querystring';
import React from 'react';
import { Route } from 'react-router-dom';
import BoardsPage from './pages/boards';
import ProfilePage from './pages/profile';

export default function HomePage() {
  const [authState] = useAuthContext();
  const [url, userId, token] = authState.isAuthenticated
    ? [getServiceWebSocketUrl('?' + stringify({ token: authState.token })), authState.user.id, authState.token]
    : [];
  const ws = useWebSocket({
    url,
    onmessage: ev => console.log('on websocket message', ev),
    onerror: ev => console.log('on websocket error', ev),
    onopen: ev => (console.log('websocket open', ev), ws.send('hello')),
  });
  useInterval(() => ws.send('ping'), 20000);
  const userPromise = useAsync(authState.isAuthenticated && getUserProfile, [token, userId]);
  if (!userPromise.isResolved) {
    return <div>loading....</div>;
  }
  return (
    <UserContextProvider {...userPromise.result}>
      <MainLayout>
        <Breadcrumbs />
        <Route path={RoutePath.PROFILE} component={ProfilePage} />
        <Route path={RoutePath.BOARDS} component={BoardsPage} />
      </MainLayout>
    </UserContextProvider>
  );
}
