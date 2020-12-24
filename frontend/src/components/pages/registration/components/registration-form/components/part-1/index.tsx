import { getAge } from '@/lib/date';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRegistrationFormContext, RegistrationFormPartOneState, RegistrationFormContextActionType } from '../..';
import inputStyles from '@/styles/input.scss';
import Controls from '../controls';

export default function PartOne() {
  const [{ formState }, dispatch] = useRegistrationFormContext();
  const { register, errors, handleSubmit } = useForm<RegistrationFormPartOneState>({
    defaultValues: formState,
    mode: 'onChange',
  });
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  useEffect(() => {
    setIsNextButtonDisabled(!!Object.keys(errors).length);
  });
  return (
    <>
      <div>
        <input
          className={inputStyles.input}
          id='first-name'
          name='firstName'
          placeholder=''
          required
          ref={register({ required: 'Please enter your first name' })}
        />
        <label htmlFor='first-name'>First name</label>
        {errors.firstName && <span role='alert'>{errors.firstName.message}</span>}
        <input
          className={inputStyles.input}
          id='last-name'
          name='lastName'
          placeholder=''
          required
          ref={register({ required: 'Please enter your last name' })}
        />
        <label htmlFor='last-name'>Last name</label>
        {errors.lastName && <span role='alert'>{errors.lastName.message}</span>}
      </div>
      <input
        className={inputStyles.input}
        id='date-of-birth'
        name='dateOfBirth'
        type='date'
        placeholder=''
        required
        ref={register({
          required: 'Please enter your date of birth',
          validate(value) {
            const age = getAge(value);
            if (isNaN(age) || age <= 0) return 'Please enter a correct date of birth';
            if (age <= 12) return 'You must be at least 12 years old to register';
            if (age >= 120) return "You can't possibly be older than 120";
            return;
          },
        })}
      />
      <label htmlFor='date-of-birth'>Date of birth</label>
      {errors.dateOfBirth && <span role='alert'>{errors.dateOfBirth.message}</span>}
      <Controls
        isNextButtonDisabled={isNextButtonDisabled}
        onNextButtonClick={handleSubmit(
          payload => dispatch({ type: RegistrationFormContextActionType.SUBMIT_PART_ONE, payload }),
          () => setIsNextButtonDisabled(true),
        )}
      />
    </>
  );
}
