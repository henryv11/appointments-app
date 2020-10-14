import { User } from '../@types/user';
import BuildContext from '../higher-order-components/BuildContext';

const [AuthContextProvider, useAuthContext] = BuildContext(
  { isAuthenticated: false },
  (state: AuthState, action: AuthAction) => {
    switch (action.type) {
      case 'LOG_IN':
        return { ...state, isAuthenticated: true, ...action.payload };

      case 'LOG_OUT':
        return { ...state, isAuthenticated: false, token: undefined, user: undefined };
    }
  },
);

type AuthState = { isAuthenticated: boolean; token?: string; user?: Pick<User, 'id' | 'username'> };

type AuthAction = { type: 'LOG_IN'; payload: Required<Pick<AuthState, 'token' | 'user'>> } | { type: 'LOG_OUT' };

export { AuthContextProvider, useAuthContext };
