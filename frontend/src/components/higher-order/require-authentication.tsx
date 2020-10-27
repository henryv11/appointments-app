import { useAuthContext } from '@/components/contexts/auth';
import { refreshSession } from '@/services/auth';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

export default function RequireAuthentication({ children }: PropsWithChildren<unknown>) {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  async function checkAuthentication() {
    if (isAuthenticated) return setIsLoading(false);
    const token = localStorage.getItem('refreshToken');
    if (!token) return setIsLoading(false);
    localStorage.removeItem('refreshToken');
    try {
      const payload = await refreshSession(token);
      dispatch({ type: 'LOG_IN', payload });
    } catch (error) {
      console.error('failed to check authentication', error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => void checkAuthentication());
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Redirect to='/login' />;
  return <>{children}</>;
}
