import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../@types/user';
import { loginUser } from '../../services/auth';

interface LoginFormProps {
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
}

export default function LoginForm({ onSuccess = () => void 0, onError = () => void 0 }: LoginFormProps) {
  const { register, handleSubmit, errors } = useForm<Pick<User, 'username' | 'password'>>();
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const onSubmit = (data: Pick<User, 'username' | 'password'>) =>
    loginUser(data)
      .catch(({ message = 'login failed' }) => {
        onError(message);
        setLoginErrorMessage(message);
      })
      .then(onSuccess);

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name='username'
        type='text'
        label={errors.username?.message || 'Username'}
        inputRef={register({ required: 'Please enter your username' })}
        error={!!errors.username}
      />
      <TextField
        name='password'
        type='password'
        label={errors.username?.message || 'Password'}
        inputRef={register({ required: 'Please enter your password' })}
        error={!!errors.username}
      />
      <Button type='submit'>Login</Button>
    </form>
  );
}
