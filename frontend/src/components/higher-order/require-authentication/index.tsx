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
      const session = await refreshSession(authState.refreshToken);
      dispatch({ type: AuthContextActionType.LOG_IN, payload: session });
      return true;
    } catch (error) {
      dispatch({ type: AuthContextActionType.LOG_OUT });
      return false;
    }
  });

  if (promise.isPending) return <div>loading...</div>;
  if ((promise.isResolved && !promise.result) || promise.isRejected) return <Redirect to={RoutePath.LOGIN} />;
  return <>{children}</>;
}
