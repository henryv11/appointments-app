import { User } from '../@types/user';
import MakeContext from '../higher-order-components/MakeContext';

const [AuthContextProvider, useAuthContext] = MakeContext(
  { isAuthenticated: false },
  (state: AuthState, action: AuthAction) => {
    switch (action.type) {
      case 'LOG_IN':
        localStorage.setItem('token', action.payload.token);
        return { ...state, isAuthenticated: true, ...action.payload };

      case 'LOG_OUT':
        localStorage.removeItem('token');
        return { ...state, isAuthenticated: false, token: undefined, user: undefined };
    }
  },
);

type AuthState = { isAuthenticated: boolean; token?: string; user?: Pick<User, 'id' | 'username'> };

type AuthAction = { type: 'LOG_IN'; payload: Required<Pick<AuthState, 'token' | 'user'>> } | { type: 'LOG_OUT' };

export { AuthContextProvider, useAuthContext };
