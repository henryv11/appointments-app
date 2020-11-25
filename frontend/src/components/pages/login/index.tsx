import SimpleLayout from '@/components/layouts/simple';
import { AuthContextActionType, useAuthContext } from '@/contexts/auth';
import { useTimeout } from '@/lib/react/hooks/timeout';
import { loginUser, registerUser } from '@/services/auth';
import React, { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './forms/login';
import RegistrationForm from './forms/registration';
import styles from './styles.scss';

export default function LoginPage() {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const [isRegistration, setIsRegistration] = useState(false);
  const [error, setError] = useState('');
  const timeoutRef = useRef<number>();

  useTimeout(() => setError(''), timeoutRef.current);

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  console.log('hello');

  function onError(message: string) {
    setError(message);
    timeoutRef.current = 5000;
  }

  return (
    <SimpleLayout>
      <div className={styles.root}>
        <div>
          <h2>{isRegistration ? 'Registration' : 'Login'}</h2>
        </div>
        <hr />
        <div>
          {isRegistration ? (
            <RegistrationForm
              onSubmit={async data => {
                try {
                  dispatch({ type: AuthContextActionType.LOG_IN, payload: await registerUser(data) });
                } catch (error) {
                  onError(error.message);
                }
              }}
            ></RegistrationForm>
          ) : (
            <LoginForm
              onSubmit={async data => {
                try {
                  dispatch({ type: AuthContextActionType.LOG_IN, payload: await loginUser(data) });
                } catch (error) {
                  onError(error.message);
                }
              }}
            ></LoginForm>
          )}
        </div>
        <a onClick={() => setIsRegistration(!isRegistration)}>
          {isRegistration ? 'Already have an account? Log in instead.' : "Don't have an account? Register here."}
        </a>
      </div>
    </SimpleLayout>
  );
}
