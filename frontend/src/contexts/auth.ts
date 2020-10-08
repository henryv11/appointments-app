import * as React from 'react';

export type AuthState =
  | { isAuthenticated: false }
  | { isAuthenticated: true; token: string; user: { id: number; username: string } };

const authState: AuthState = {
  isAuthenticated: false,
};

export const authContext = React.createContext<AuthState>(authState);
