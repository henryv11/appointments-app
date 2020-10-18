import { User } from '../@types/user';
import MakeContext from '../higher-order-components/MakeContext';

const [AuthContextProvider, useAuthContext] = MakeContext(
  { isAuthenticated: false },
  (state: AuthState, action: AuthAction) => {
    switch (action.type) {
      case 'LOG_IN':
        const { refreshToken, ...rest } = action.payload;
        localStorage.setItem('refreshToken', refreshToken);
        return { ...state, isAuthenticated: true, ...rest };

      case 'LOG_OUT':
        localStorage.removeItem('refreshToken');
        return { ...state, isAuthenticated: false, token: undefined, user: undefined };
    }
  },
);

type AuthState = { isAuthenticated: boolean; token?: string; user?: Pick<User, 'id' | 'username'> };

type AuthAction =
  | { type: 'LOG_IN'; payload: Required<Pick<AuthState, 'token' | 'user'>> & { refreshToken: string } }
  | { type: 'LOG_OUT' };

export { AuthContextProvider, useAuthContext };
