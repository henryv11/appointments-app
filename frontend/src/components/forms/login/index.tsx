import React from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../../@types/user';
import './index.css';

export default function LoginForm({ onSubmit = () => void 0 }: LoginFormProps) {
  const { register, handleSubmit, errors } = useForm<LoginForm>();

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(data => onSubmit(data))}>
      <input
        id='username'
        name='username'
        type='text'
        required
        ref={register({
          required: 'Username is required',
        })}
      />
      <input
        id='password'
        name='password'
        type='password'
        required
        ref={register({
          required: 'Password is required',
        })}
      />
      <button color='primary' type='submit'>
        Log In
      </button>
    </form>
  );
}

interface LoginFormProps {
  onSubmit?: (data: LoginForm) => void;
}

type LoginForm = Pick<User, 'username' | 'password'>;
