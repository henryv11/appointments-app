import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRegistrationFormContext, RegistrationFormContextActionType, RegistrationFormPartTwoState } from '../..';
import inputStyles from '@/styles/input.scss';
import Controls from '../controls';

export default function PartTwo() {
  const [{ formState }, dispatch] = useRegistrationFormContext();
  const { register, errors, handleSubmit, getValues } = useForm<RegistrationFormPartTwoState>({
    defaultValues: formState,
    mode: 'onChange',
  });
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  useEffect(() => {
    setIsNextButtonDisabled(!!Object.keys(errors).length);
  });
  return (
    <>
      <input
        id='username'
        name='username'
        placeholder=''
        className={inputStyles.input}
        required
        ref={register({
          required: 'Please enter your username',
          minLength: {
            value: 6,
            message: 'Username has to be at least 6 characters long',
          },
        })}
      />
      <label htmlFor='username'>Username</label>
      {errors.username && <span role='alert'>{errors.username.message}</span>}
      <input
        id='password'
        name='password'
        type='password'
        placeholder=''
        className={inputStyles.input}
        required
        ref={register({
          required: 'Please enter your password',
          minLength: {
            value: 8,
            message: 'Password has to be at least 8 characters long',
          },
          pattern: {
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            message: 'Password must contain an upper case letter, an lower case letter, and an number',
          },
        })}
      />
      <label htmlFor='password'>Password</label>
      {errors.password && <span role='alert'>{errors.password.message}</span>}
      <input
        id='password-confirm'
        name='passwordConfirm'
        type='password'
        placeholder=''
        className={inputStyles.input}
        required
        ref={register({
          required: 'Please confirm your password',
          validate(value) {
            if (value !== getValues('password')) return 'Password is not matching';
            return;
          },
        })}
      />
      <label htmlFor='password-confirm'>Confirm password</label>
      {errors.passwordConfirm && <span role='alert'>{errors.passwordConfirm.message}</span>}
      <Controls
        isNextButtonDisabled={isNextButtonDisabled}
        onNextButtonClick={handleSubmit(
          payload => dispatch({ type: RegistrationFormContextActionType.SUBMIT_PART_TWO, payload }),
          () => setIsNextButtonDisabled(true),
        )}
        onPreviousButtonClick={() =>
          dispatch({ type: RegistrationFormContextActionType.PREVIOUS_STEP, payload: getValues() })
        }
      />
    </>
  );
}
