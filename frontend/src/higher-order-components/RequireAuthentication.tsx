import React, { PropsWithChildren, ReactElement } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/Auth';

export default function RequireAuthentication({ children }: PropsWithChildren<unknown>) {
  const [{ isAuthenticated }] = useAuthContext();
  if (!isAuthenticated) return <Redirect to='/login' />;
  return children as ReactElement;
}
