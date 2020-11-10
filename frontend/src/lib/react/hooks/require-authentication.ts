import { AuthContextActionType, useAuthContext } from '@/contexts/auth';
import { LocalStorageKey } from '@/lib/constants';
import { refreshSession } from '@/services/auth';
import { useAsync } from './async';

export function useRequireAuthentication({ onNotAuthenticated = () => void 0 }: { onNotAuthenticated?: () => void }) {
  const [authState, dispatch] = useAuthContext();
  const { isResolved } = useAsync(async () => {
    if (authState.isAuthenticated) return;
    const token = localStorage.getItem(LocalStorageKey.REFRESH_TOKEN);
    dispatch({ type: AuthContextActionType.LOG_OUT });
    if (!token) return;
    dispatch({ type: AuthContextActionType.LOG_IN, payload: await refreshSession(token) });
  });
  if (isResolved && !authState.isAuthenticated) onNotAuthenticated();
  return authState;
}
