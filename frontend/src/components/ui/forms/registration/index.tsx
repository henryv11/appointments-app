import { useMultiStepForm } from '@/lib/hooks/multi-step-form';
import buttonStyles from '@/styles/button.scss';
import inputStyles from '@/styles/input.scss';
import { UserRegistration } from '@/types/user';
import clsx from 'clsx';
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
        {isPreviousButtonVisible && (
          <button onClick={previousStep} className={clsx(buttonStyles.button, buttonStyles.primary)}>
            Previous
          </button>
        )}
        {isNextButtonVisible && (
          <button
            disabled={isNextButtonDisabled}
            onClick={nextStep}
            className={clsx(buttonStyles.button, buttonStyles.primary)}
          >
            Next
          </button>
        )}
        {isSubmitButtonVisible && (
          <button
            disabled={isNextButtonDisabled}
            color='primary'
            type='submit'
            className={clsx(buttonStyles.button, buttonStyles.primary)}
          >
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
        <input
          className={inputStyles.input}
          id='first-name'
          name='firstName'
          required
          ref={register({ required: 'Please enter your first name' })}
        />
        <label htmlFor='first-name'>First name</label>
        {errors.firstName && <span>{errors.firstName.message}</span>}
        <input
          className={inputStyles.input}
          id='last-name'
          name='lastName'
          required
          ref={register({ required: 'Please enter your last name' })}
        />
        <label htmlFor='last-name'>Last name</label>
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <input
        className={inputStyles.input}
        id='date-of-birth'
        name='dateOfBirth'
        required
        type='date'
        ref={register({
          required: 'Please enter your date of birth',
          validate(value) {
            const age = Math.floor((new Date().getTime() - new Date(value).getTime()) / 3.154e10);
            if (isNaN(age) || age <= 0) return 'Please enter a correct date';
            if (age <= 12) return 'You must be at least 12 years old to register';
            if (age >= 120) return "You can't possibly be older than 120";
            return;
          },
        })}
      />
      <label htmlFor='date-of-birth'>Date of birth</label>
      {errors.dateOfBirth && <span>{errors.dateOfBirth.message}</span>}
    </>
  );
}

function RegistrationFormPartTwo({ form: { errors, register } }: { form: UseFormMethods<RegistrationForm> }) {
  return (
    <>
      <input
        id='username'
        name='username'
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
      {errors.username && <span>{errors.username.message}</span>}
      <input
        id='password'
        name='password'
        type='password'
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
      {errors.password && <span>{errors.password.message}</span>}
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
