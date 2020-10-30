import buttonStyles from '@/styles/button.scss';
import inputStyles from '@/styles/input.scss';
import { User } from '@/types/user';
import clsx from 'clsx';
import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './styles.scss';

export default function LoginForm({ onSubmit = () => void 0 }: LoginFormProps) {
  const { register, handleSubmit, errors } = useForm<LoginForm>();

  return (
    <form className={styles.root} noValidate autoComplete='off' onSubmit={handleSubmit(data => onSubmit(data))}>
      <input
        className={inputStyles.input}
        id='username'
        name='username'
        required
        ref={register({
          required: 'Username is required',
        })}
      />
      <label htmlFor='username'>username</label>
      {errors.username && <span role='alert'>{errors.username.message}</span>}
      <input
        className={inputStyles.input}
        id='password'
        name='password'
        type='password'
        required
        ref={register({
          required: 'Password is required',
        })}
      />
      <label htmlFor='password'>password</label>
      {errors.password && <span role='alert'>{errors.password.message}</span>}
      <button className={clsx(buttonStyles.button, buttonStyles.primary)} type='submit'>
        Log In
      </button>
    </form>
  );
}

interface LoginFormProps {
  onSubmit?: (data: LoginForm) => void;
}

type LoginForm = Pick<User, 'username' | 'password'>;
