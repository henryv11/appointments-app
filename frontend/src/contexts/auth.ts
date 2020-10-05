import * as React from 'react';

export type AuthState =
  | { isAuthenticated: false; user: null }
  | { isAuthenticated: true; user: { id: number; username: string } };

const authState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authContext = React.createContext<AuthState>(authState);
