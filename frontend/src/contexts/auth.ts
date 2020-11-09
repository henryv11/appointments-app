import { LocalStorageKey } from '@/lib/constants';
import { createReducerContext } from '@/lib/react/create-reducer-context';
import { User } from '@/types/user';

export const [AuthContextProvider, AuthContextConsumer, useAuthContext] = createReducerContext<AuthState, AuthAction>(
  { isAuthenticated: false },
  (state, action) => {
    switch (action.type) {
      case AuthContextActionType.LOG_IN:
        const { refreshToken, ...rest } = action.payload;
        localStorage.setItem(LocalStorageKey.REFRESH_TOKEN, refreshToken);
        return { ...state, isAuthenticated: true, ...rest };

      case AuthContextActionType.LOG_OUT:
        localStorage.removeItem(LocalStorageKey.REFRESH_TOKEN);
        return { ...state, isAuthenticated: false, token: undefined, user: undefined };
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
  user: Pick<User, 'id' | 'username'>;
}

interface LoggedOutState {
  isAuthenticated: false;
}

type AuthState = LoggedInState | LoggedOutState;

type AuthAction =
  | { type: AuthContextActionType.LOG_IN; payload: Pick<LoggedInState, 'token' | 'user'> & { refreshToken: string } }
  | { type: AuthContextActionType.LOG_OUT };
