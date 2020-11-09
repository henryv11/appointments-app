import { AuthContextActionType, useAuthContext } from '@/contexts/auth';
import { LocalStorageKey } from '@/lib/constants';
import { refreshSession } from '@/services/auth';
import { useAsync } from './async';

export function useRequireAuthentication({
  onAuthenticated = () => void 0,
  onNotAuthenticated = () => void 0,
}: {
  onAuthenticated?: () => void;
  onNotAuthenticated?: () => void;
}) {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const { isResolved } = useAsync(async () => {
    if (isAuthenticated) return;
    const token = localStorage.getItem(LocalStorageKey.REFRESH_TOKEN);
    dispatch({ type: AuthContextActionType.LOG_OUT });
    if (!token) return;
    dispatch({ type: AuthContextActionType.LOG_IN, payload: await refreshSession(token) });
  });

  if (isResolved) isAuthenticated ? onAuthenticated() : onNotAuthenticated();
}
