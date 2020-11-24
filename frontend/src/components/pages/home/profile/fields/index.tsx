import { useUserContext } from '@/contexts/user';
import buttonStyles from '@/styles/button.scss';
import inputStyles from '@/styles/input.scss';
import clsx from 'clsx';
import React from 'react';
import rootStyles from '../styles.scss';
import styles from './styles.scss';

export default function UserFields() {
  const [{ username, email, firstName, lastName, dateOfBirth }] = useUserContext();

  return (
    <div className={styles.root}>
      <h4 className={rootStyles.header}>
        Personal details
        <button className={clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.small)}>Edit</button>
      </h4>
      <input name='username' id='username' value={username} readOnly className={inputStyles.input} />
      <label htmlFor='username'>Username</label>
      <input name='email' id='email' value={email} readOnly className={inputStyles.input} />
      <label htmlFor='email'>Email</label>
      <input name='firstName' id='firstName' value={firstName} readOnly className={inputStyles.input} />
      <label htmlFor='firstName'>First Name</label>
      <input name='lastName' id='lastName' value={lastName} readOnly className={inputStyles.input} />
      <label htmlFor='lastName'>Last Name</label>
      <input
        type='date'
        name='dateOfBirth'
        id='dateOfBirth'
        value={dateOfBirth.split('T')[0]}
        readOnly
        className={inputStyles.input}
      />
      <label htmlFor='dateOfBirth'>Date of birth</label>
    </div>
  );
}
