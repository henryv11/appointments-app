import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/Auth';
import { refreshToken } from '../services/auth';

export default function RequireAuthentication({ children }: PropsWithChildren<unknown>) {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  async function checkAuthentication() {
    if (isAuthenticated) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    localStorage.removeItem('token');
    try {
      const payload = await refreshToken(token);
      dispatch({ type: 'LOG_IN', payload });
    } catch (error) {
      return;
    }
  }
  useEffect(() => void checkAuthentication());
  if (!isAuthenticated) return <Redirect to='/login' />;
  return children as ReactElement;
}
