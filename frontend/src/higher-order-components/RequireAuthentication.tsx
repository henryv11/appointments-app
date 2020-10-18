import Backdrop from '@material-ui/core/Backdrop/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/Auth';
import { refreshSession } from '../services/auth';

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
  if (isLoading)
    return (
      <Backdrop open={true} transitionDuration={25}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  if (!isAuthenticated) return <Redirect to='/login' />;
  return children as ReactElement;
}
