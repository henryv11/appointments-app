import MainLayout from '@/components/layouts/main';
import Breadcrumbs from '@/components/common/breadcrumbs';
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
import RequireAuthentication from '@/components/higher-order/require-authentication';

function HomePage() {
  const [authState] = useAuthContext();
  const [getUser, webSocketUrl, userId, token] = authState.isAuthenticated
    ? [
        getUserProfile,
        getServiceWebSocketUrl('?' + stringify({ token: authState.token })),
        authState.userId,
        authState.token,
      ]
    : [];
  const webSocket = useWebSocket({
    url: webSocketUrl,
    onmessage: event => console.log('on websocket message', event),
    onerror: event => console.log('on websocket error', event),
    onopen: event => (console.log('websocket open', event), webSocket.send('hello')),
  });
  const userPromise = useAsync(getUser, [token, userId]);
  
  useInterval(() => webSocket.send('ping'), 20000);

  if (!userPromise.isResolved) return <div>loading....</div>;

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

export default RequireAuthentication(HomePage);
