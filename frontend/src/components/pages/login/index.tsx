import { useAuthContext } from '@/components/contexts/auth';
import SimpleLayout from '@/components/layouts/simple';
import LoginForm from '@/components/ui/forms/login';
import RegistrationForm from '@/components/ui/forms/registration';
import { useTimeout } from '@/lib/hooks/timeout';
import { loginUser, registerUser } from '@/services/auth';
import React, { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styles from './styles.css';

export default function LoginPage() {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const [isRegistration, setIsRegistration] = useState(false);
  const [error, setError] = useState('');
  const currentTimeoutRef = useRef<NodeJS.Timeout>();

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  function onError(message: string) {
    setError(message);
    if (currentTimeoutRef.current) clearTimeout(currentTimeoutRef.current);
    currentTimeoutRef.current = useTimeout(() => setError(''), 5000);
  }

  return (
    <SimpleLayout>
      <div className={styles.root}>
        <div>
          <h4>{isRegistration ? 'Registration' : 'Login'}</h4>
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
