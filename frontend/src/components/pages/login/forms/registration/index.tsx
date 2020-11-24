import { createReducerContext } from '@/lib/react/create-reducer-context';
import buttonStyles from '@/styles/button.scss';
import inputStyles from '@/styles/input.scss';
import { UserRegistration } from '@/types/user';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './styles.scss';

export default function RegistrationForm({ onSubmit = () => void 0 }: RegistrationFormProps) {
  return (
    <RegistrationFormProvider onSubmit={onSubmit}>
      <form className={styles.root} noValidate autoComplete='off'>
        <RegistrationFormConsumer>
          {([{ currentStep }]) => (
            <>
              <RegistrationFormHeader />
              {currentStep === 0 && <RegistrationFormPartOne />}
              {currentStep === 1 && <RegistrationFormPartTwo />}
              {currentStep === 2 && <RegistrationFormPartThree />}
            </>
          )}
        </RegistrationFormConsumer>
      </form>
    </RegistrationFormProvider>
  );
}

/* #region  Sub components */
function RegistrationFormHeader() {
  const [{ currentStep }] = useRegistrationFormContext();
  return (
    <div className={styles.header}>
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

function RegistrationFormPartOne() {
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
        placeholder=''
        required
        type='date'
        ref={register({
          required: 'Please enter your date of birth',
          validate(value) {
            const age = Math.floor((new Date().getTime() - new Date(value).getTime()) / 3.154e10);
            if (isNaN(age) || age <= 0) return 'Please enter a correct date of birth';
            if (age <= 12) return 'You must be at least 12 years old to register';
            if (age >= 120) return "You can't possibly be older than 120";
            return;
          },
        })}
      />
      <label htmlFor='date-of-birth'>Date of birth</label>
      {errors.dateOfBirth && <span role='alert'>{errors.dateOfBirth.message}</span>}
      <div className={styles.controls}>
        <button
          className={clsx(buttonStyles.button, buttonStyles.primary)}
          disabled={isNextButtonDisabled}
          onClick={handleSubmit(
            payload => dispatch({ type: RegistrationFormContextActionType.SUBMIT_PART_ONE, payload }),
            () => setIsNextButtonDisabled(true),
          )}
        >
          Next
        </button>
      </div>
    </>
  );
}

function RegistrationFormPartTwo() {
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
      <div className={styles.controls}>
        <button
          className={clsx(buttonStyles.button, buttonStyles.primary)}
          onClick={() => dispatch({ type: RegistrationFormContextActionType.PREVIOUS_STEP, payload: getValues() })}
        >
          Previous
        </button>
        <button
          className={clsx(buttonStyles.button, buttonStyles.primary)}
          disabled={isNextButtonDisabled}
          onClick={handleSubmit(
            payload => dispatch({ type: RegistrationFormContextActionType.SUBMIT_PART_TWO, payload }),
            () => setIsNextButtonDisabled(true),
          )}
        >
          Next
        </button>
      </div>
    </>
  );
}

function RegistrationFormPartThree() {
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
      <div className={styles.controls}>
        <button
          className={clsx(buttonStyles.button, buttonStyles.primary)}
          onClick={() => dispatch({ type: RegistrationFormContextActionType.PREVIOUS_STEP, payload: getValues() })}
        >
          Previous
        </button>
        <button
          className={clsx(buttonStyles.button, buttonStyles.primary)}
          disabled={isNextButtonDisabled}
          type='submit'
          onClick={handleSubmit(
            payload => dispatch({ type: RegistrationFormContextActionType.SUBMIT_PART_THREE, payload }),
            () => setIsNextButtonDisabled(true),
          )}
        >
          Sign up
        </button>
      </div>
    </>
  );
}
/* #endregion */

/* #region  Context */
const [RegistrationFormProvider, RegistrationFormConsumer, useRegistrationFormContext] = createReducerContext<
  RegistrationFormContext,
  RegistrationFormAction
>(
  { currentStep: 0, onSubmit: () => void 0, formState: {} },
  (state, action) => {
    switch (action.type) {
      case RegistrationFormContextActionType.SUBMIT_PART_ONE:
      case RegistrationFormContextActionType.SUBMIT_PART_TWO:
        return { ...state, currentStep: state.currentStep + 1, formState: { ...state.formState, ...action.payload } };
      case RegistrationFormContextActionType.SUBMIT_PART_THREE:
        const { passwordConfirm, ...formState } = { ...state.formState, ...action.payload };
        state.onSubmit(formState as RegistrationFormSubmit);
        return { ...state, formState: { passwordConfirm, ...formState } };
      case RegistrationFormContextActionType.PREVIOUS_STEP:
        return { ...state, currentStep: state.currentStep - 1, formState: { ...state.formState, ...action.payload } };
    }
  },
  'registration form',
);

enum RegistrationFormContextActionType {
  SUBMIT_PART_ONE,
  SUBMIT_PART_TWO,
  SUBMIT_PART_THREE,
  PREVIOUS_STEP,
}
/* #endregion */

/* #region  Types */
interface RegistrationFormProps {
  onSubmit?: (data: RegistrationFormSubmit) => void;
}

interface RegistrationFormContext {
  currentStep: number;
  onSubmit: NonNullable<RegistrationFormProps['onSubmit']>;
  formState: Partial<RegistrationFormState>;
}
type RegistrationFormState = UserRegistration & { passwordConfirm: string };
type RegistrationFormSubmit = Omit<RegistrationFormState, 'passwordConfirm'>;
type RegistrationFormPartOneState = Pick<RegistrationFormState, 'firstName' | 'lastName' | 'dateOfBirth'>;
type RegistrationFormPartTwoState = Pick<RegistrationFormState, 'username' | 'password' | 'passwordConfirm'>;
type RegistrationFormPartThreeState = Pick<RegistrationFormState, 'email' | 'hasAcceptedTermsAndConditions'>;
type RegistrationFormAction =
  | { type: RegistrationFormContextActionType.SUBMIT_PART_ONE; payload: RegistrationFormPartOneState }
  | { type: RegistrationFormContextActionType.SUBMIT_PART_TWO; payload: RegistrationFormPartTwoState }
  | { type: RegistrationFormContextActionType.SUBMIT_PART_THREE; payload: RegistrationFormPartThreeState }
  | { type: RegistrationFormContextActionType.PREVIOUS_STEP; payload: Partial<RegistrationFormState> };

/* #endregion */
