import React from 'react';
import { useRegistrationFormContext } from '../..';
import styles from './styles.scss';

export default function Header() {
  const [{ currentStep }] = useRegistrationFormContext();
  return (
    <div className={styles.root}>
      <h4>{['Personal information', 'Account information', 'Almost there...'][currentStep]}</h4>
      <hr />
      <h6>
        {
          [
            'Please tell us about yourself',
            'Please choose your username and password',
            'We need to know this shit man',
          ][currentStep]
        }
      </h6>
    </div>
  );
}
