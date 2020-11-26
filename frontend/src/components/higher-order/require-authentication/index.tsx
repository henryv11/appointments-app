import { AuthContextActionType, useAuthContext } from '@/contexts/auth';
import { RoutePath } from '@/lib/constants';
import { useAsync } from '@/lib/react/hooks/async';
import { refreshSession } from '@/services/auth';
import React, { PropsWithChildren } from 'react';
import { Redirect } from 'react-router-dom';

export default function RequireAuthentication({ children }: PropsWithChildren<unknown>) {
  const [authState, dispatch] = useAuthContext();

  const promise = useAsync(async () => {
    if (authState.isAuthenticated) return true;
    if (!authState.refreshToken) return false;
    try {
      dispatch({ type: AuthContextActionType.LOG_IN, payload: await refreshSession(authState.refreshToken) });
      return true;
    } catch (error) {
      dispatch({ type: AuthContextActionType.LOG_OUT });
      return false;
    }
  });

  if (promise.isPending || promise.isIdle) return <div>loading...</div>;
  if (promise.isResolved && promise.result) return <>{children}</>;
  return <Redirect to={RoutePath.LOGIN} />;
}
