import { useMultiStepForm } from '@/lib/hooks/multi-step-form';
import { UserRegistration } from '@/types/user';
import React from 'react';
import { UseFormMethods } from 'react-hook-form';

export default function RegistrationForm({ onSubmit = () => void 0 }: RegistrationFormProps) {
  const {
    activeStep,
    previousStep,
    nextStep,
    isPreviousButtonVisible,
    isNextButtonDisabled,
    isNextButtonVisible,
    isSubmitButtonVisible,
    ...form
  } = useMultiStepForm<RegistrationForm>({ steps: 3 });

  return (
    <form noValidate autoComplete='off' onSubmit={form.handleSubmit(data => onSubmit(data))}>
      <div>
        <h4>{['Personal information', 'Account information', 'Almost there...'][activeStep]}</h4>
        <hr />
        <h6>
          {
            [
              'Please tell us about yourself',
              'Please choose your username and password',
              'We need to know this shit man',
            ][activeStep]
          }
        </h6>
      </div>
      {activeStep === 0 && <RegistrationFormPartOne form={form} />}
      {activeStep === 1 && <RegistrationFormPartTwo form={form} />}
      {activeStep === 2 && <RegistrationFormPartThree form={form} />}
      <div>
        {isPreviousButtonVisible && <button onClick={previousStep}>Previous</button>}
        {isNextButtonVisible && (
          <button disabled={isNextButtonDisabled} onClick={nextStep}>
            Next
          </button>
        )}
        {isSubmitButtonVisible && (
          <button disabled={isNextButtonDisabled} color='primary' type='submit'>
            Sign Up
          </button>
        )}
      </div>
    </form>
  );
}

function RegistrationFormPartOne({ form: { register, errors } }: { form: UseFormMethods<RegistrationForm> }) {
  return (
    <>
      <div>
        <input id='firstName' name='firstName' required ref={register({ required: 'Please enter your first name' })} />
        <input name='lastName' required ref={register({ required: 'Please enter your last name' })} />
      </div>
      <input
        name='dateOfBirth'
        required
        type='date'
        ref={register({
          required: 'Please enter your date of birth',
          validate(value) {
            const age = Math.floor((new Date().getTime() - new Date(value).getTime()) / 3.154e10);
            if (isNaN(age) || age <= 0) return 'Please enter correct date';
            if (age <= 12) return 'You must be at least 12 years old to register';
            if (age >= 120) return "You can't possibly be older than 120";
            return;
          },
        })}
      />
    </>
  );
}

function RegistrationFormPartTwo({ form: { errors, register } }: { form: UseFormMethods<RegistrationForm> }) {
  return (
    <>
      <input
        name='username'
        required
        ref={register({
          required: 'Please enter your username',
          minLength: {
            value: 6,
            message: 'Username has to be at least 6 characters long',
          },
        })}
      />
      <input
        name='password'
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
    </>
  );
}

function RegistrationFormPartThree({ form: { errors, register } }: { form: UseFormMethods<RegistrationForm> }) {
  return (
    <>
      <input
        id='email'
        name='email'
        type='email'
        required
        ref={register({
          required: 'Please enter your email',
        })}
      />

      <input
        id='has-accepted-terms-and-conditions'
        name='hasAcceptedTermsAndConditions'
        type='checkbox'
        ref={register({
          required: 'You need to accept terms and conditions mate',
        })}
      />
    </>
  );
}

interface RegistrationFormProps {
  onSubmit?: (data: RegistrationForm) => void;
}

type RegistrationForm = UserRegistration;
