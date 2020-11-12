import { useAuthContext } from '@/contexts/auth';
import { refreshSession } from '@/services/auth';
import { useHistory } from 'react-router-dom';
import { useAsync } from './async';

export function useRequireAuthentication() {
  const { push } = useHistory();
  const [authState, dispatch] = useAuthContext();
  const [isLoading, result, error] = useAsync(() => {
    if (authState.isAuthenticated || !authState.refreshToken) return undefined;
    return refreshSession(authState.refreshToken);
  });

  if (isLoading) return authState;

  if (error) return '';
  // if (result)
  if (result) return 'f';
  // if (isResolved && !authState.isAuthenticated) return push(RoutePath.LOGIN) as never;
  return authState;
}
