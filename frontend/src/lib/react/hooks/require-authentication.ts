import { AuthContextActionType, useAuthContext } from '@/contexts/auth';
import { RoutePath } from '@/lib/constants';
import { refreshSession } from '@/services/auth';
import { useHistory } from 'react-router-dom';
import { useAsync } from './async';

export function useRequireAuthentication() {
  const [authState, dispatch] = useAuthContext();
  const { push } = useHistory();
  const promise = useAsync(() => {
    if (authState.isAuthenticated) return Promise.resolve(true);
    if (!authState.refreshToken) return Promise.resolve(false);
    return refreshSession(authState.refreshToken);
  });
  if (promise.isResolved && typeof promise.result !== 'boolean')
    dispatch({ type: AuthContextActionType.LOG_IN, payload: promise.result });
  else if ((promise.isResolved && !promise.result) || promise.isRejected)
    dispatch({ type: AuthContextActionType.LOG_OUT }), push(RoutePath.LOGIN);
  return authState;
}
