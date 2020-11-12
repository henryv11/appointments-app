import { LocalStorageKey } from '@/lib/constants';
import { createReducerContext } from '@/lib/react/create-reducer-context';
import { User } from '@/types/user';

export const [AuthContextProvider, AuthContextConsumer, useAuthContext] = createReducerContext<AuthState, AuthAction>(
  { isAuthenticated: false, refreshToken: localStorage.getItem(LocalStorageKey.REFRESH_TOKEN) || undefined },
  (state, action) => {
    switch (action.type) {
      case AuthContextActionType.LOG_IN:
        localStorage.setItem(LocalStorageKey.REFRESH_TOKEN, action.payload.refreshToken);
        return { ...state, isAuthenticated: true, ...action.payload };

      case AuthContextActionType.LOG_OUT:
        localStorage.removeItem(LocalStorageKey.REFRESH_TOKEN);
        return { isAuthenticated: false };
    }
  },
);

export enum AuthContextActionType {
  LOG_IN,
  LOG_OUT,
}

interface LoggedInState {
  isAuthenticated: true;
  token: string;
  refreshToken: string;
  user: Pick<User, 'id' | 'username'>;
}

interface LoggedOutState {
  isAuthenticated: false;
  refreshToken?: string;
}

type AuthState = LoggedInState | LoggedOutState;

type AuthAction =
  | { type: AuthContextActionType.LOG_IN; payload: Omit<LoggedInState, 'isAuthenticated'> }
  | { type: AuthContextActionType.LOG_OUT };
