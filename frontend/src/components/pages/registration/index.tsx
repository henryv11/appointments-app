import SimpleLayout from '@/components/layouts/simple';
import { AuthContextActionType, useAuthContext } from '@/contexts/auth';
import { RoutePath } from '@/lib/constants';
import { registerUser } from '@/services/auth';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import RegistrationForm from './components/registration-form';
import styles from './styles.scss';

export default function LoginPage() {
  const [{ isAuthenticated }, dispatch] = useAuthContext();
  const { push } = useHistory();

  if (isAuthenticated) {
    return <Redirect to={RoutePath.HOME} />;
  }

  return (
    <SimpleLayout>
      <div className={styles.root}>
        <div>
          <h2>Registration</h2>
        </div>
        <hr />
        <div>
          <RegistrationForm
            onSubmit={async data => {
              try {
                const payload = await registerUser(data);
                dispatch({ type: AuthContextActionType.LOG_IN, payload });
              } catch (error) {
                alert(error.message);
              }
            }}
          ></RegistrationForm>
        </div>
        <a onClick={() => push(RoutePath.LOGIN)} role='navigation'>
          Already have an account? Log in instead.
        </a>
      </div>
    </SimpleLayout>
  );
}
