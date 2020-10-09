import { buildContext } from '../higher-order/Build';

type AuthState = { isAuthenticated: boolean; token?: string; user?: { id: number; username: string } };

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
