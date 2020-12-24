import { AuthContextActionType, useAuthContext } from '@/contexts/auth';
import { RoutePath } from '@/lib/constants';
import { useAsync } from '@/lib/react/hooks/async';
import { refreshSession } from '@/services/auth';
import React, { ComponentType, PropsWithChildren } from 'react';
import { Redirect } from 'react-router-dom';

export default function RequireAuthentication<T>(Component: ComponentType<T>) {
  return (props: PropsWithChildren<T>) => {
    const [authState, dispatch] = useAuthContext();
    const promise = useAsync(async () => {
      if (authState.isAuthenticated) return true;
      if (!authState.refreshToken) return false;
      try {
        const payload = await refreshSession(authState.refreshToken);
        dispatch({ type: AuthContextActionType.LOG_IN, payload });
        return true;
      } catch (error) {
        dispatch({ type: AuthContextActionType.LOG_OUT });
        return false;
      }
    });
    if (promise.isResolved && promise.result) return <Component {...props} />;
    if (promise.isPending || promise.isIdle) return <div>loading...</div>;
    return <Redirect to={RoutePath.LOGIN} />;
  };
}
