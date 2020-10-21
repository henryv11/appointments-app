import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from '../../components/forms/login';
import RegistrationForm from '../../components/forms/registration';
import { useAuthContext } from '../../contexts/auth';
import { useTimeout } from '../../hooks/timeout';
import SimpleLayout from '../../layouts/simple';
import { loginUser, registerUser } from '../../services/auth';
import './index.css';

export default function LoginPage() {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const [isRegistration, setIsRegistration] = useState(false);
  const [error, setError] = useState('');
  const { set: setTimeout } = useTimeout({ ms: 5000 });

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <SimpleLayout>
      <div>
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
                  setError(error.message);
                  setTimeout(() => setError(''));
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
                  setError('login failed');
                  setTimeout(() => setError(''));
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
