import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRegistrationFormContext, RegistrationFormContextActionType, RegistrationFormPartThreeState } from '../..';
import inputStyles from '@/styles/input.scss';
import Controls from '../controls';

export default function PartThree() {
  const [{ formState }, dispatch] = useRegistrationFormContext();
  const { register, errors, handleSubmit, getValues } = useForm<RegistrationFormPartThreeState>({
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
        id='email'
        name='email'
        type='email'
        className={inputStyles.input}
        placeholder=''
        required
        ref={register({
          required: 'Please enter your email',
        })}
      />
      <label htmlFor='email'>Email</label>
      {errors.email && <span role='alert'>{errors.email.message}</span>}
      <input
        id='has-accepted-terms-and-conditions'
        name='hasAcceptedTermsAndConditions'
        className={inputStyles.input}
        placeholder=''
        type='checkbox'
        required
        ref={register({
          required: 'You need to accept terms and conditions mate',
        })}
      />
      <label htmlFor='has-accepted-terms-and-conditions'>Accept terms and conditions</label>
      {errors.hasAcceptedTermsAndConditions && <span role='alert'>{errors.hasAcceptedTermsAndConditions.message}</span>}
      <Controls
        isNextButtonDisabled={isNextButtonDisabled}
        onNextButtonClick={handleSubmit(
          payload => dispatch({ type: RegistrationFormContextActionType.SUBMIT_PART_THREE, payload }),
          () => setIsNextButtonDisabled(true),
        )}
        onPreviousButtonClick={() =>
          dispatch({ type: RegistrationFormContextActionType.PREVIOUS_STEP, payload: getValues() })
        }
      />
    </>
  );
}
