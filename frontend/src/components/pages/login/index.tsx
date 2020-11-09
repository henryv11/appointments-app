import SimpleLayout from '@/components/layouts/simple';
import LoginForm from '@/components/ui/forms/login';
import RegistrationForm from '@/components/ui/forms/registration';
import { useAuthContext } from '@/contexts/auth';
import { useTimeout } from '@/lib/react/hooks/timeout';
import { loginUser, registerUser } from '@/services/auth';
import React, { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styles from './styles.scss';

export default function LoginPage() {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const [isRegistration, setIsRegistration] = useState(true);
  const [error, setError] = useState('');
  const timeoutRef = useRef<number>();

  useTimeout(() => setError(''), timeoutRef.current);

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

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
                  const payload = await registerUser(data);
                  dispatch({ type: 'LOG_IN', payload });
                } catch (error) {
                  onError(error.message);
                }
              }}
            ></RegistrationForm>
          ) : (
            <LoginForm
              onSubmit={async data => {
                try {
                  const payload = await loginUser(data);
                  dispatch({ type: 'LOG_IN', payload });
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
