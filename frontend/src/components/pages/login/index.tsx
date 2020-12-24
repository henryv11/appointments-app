import SimpleLayout from '@/components/layouts/simple';
import { AuthContextActionType, useAuthContext } from '@/contexts/auth';
import { RoutePath } from '@/lib/constants';
import { loginUser } from '@/services/auth';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import LoginForm from './components/login-form';
import styles from './styles.scss';

export default function LoginPage() {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const { push } = useHistory();

  console.log({ isAuthenticated });

  if (isAuthenticated) {
    return <Redirect to={RoutePath.HOME} />;
  }

  return (
    <SimpleLayout>
      <div className={styles.root}>
        <div>
          <h2>Login</h2>
        </div>
        <hr />
        <div>
          <LoginForm
            onSubmit={async data => {
              try {
                const payload = await loginUser(data);
                dispatch({ type: AuthContextActionType.LOG_IN, payload });
              } catch (error) {
                alert(error.message);
              }
            }}
          ></LoginForm>
        </div>
        <a onClick={() => push(RoutePath.REGISTRATION)} role='navigation'>
          Don't have an account? Register here.
        </a>
      </div>
    </SimpleLayout>
  );
}
