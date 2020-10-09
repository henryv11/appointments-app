import { User } from '../@types/user';
import { buildContext } from '../higher-order/Build';

type AuthState = { isAuthenticated: boolean; token?: string; user?: Pick<User, 'id' | 'username'> };

type AuthDispatch = { type: string };

const [AuthContextProvider, useAuthContext] = buildContext<AuthState, AuthDispatch>(
    {
        isAuthenticated: false,
    },
    (state, { type }) => {
        throw new Error('not implemented');
    },
);

export { AuthContextProvider, useAuthContext };
