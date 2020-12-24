import { createReducerContext } from '@/lib/react/create-reducer-context';
import { UserRegistration } from '@/types/user';
import React from 'react';
import Header from './components/header';
import PartOne from './components/part-1';
import PartTwo from './components/part-2';
import PartThree from './components/part-3';

export default function RegistrationForm({ onSubmit = () => void 0 }: RegistrationFormProps) {
  return (
    <RegistrationFormProvider onSubmit={onSubmit}>
      <form noValidate autoComplete='off'>
        <RegistrationFormConsumer>
          {([{ currentStep }]) => (
            <>
              <Header />
              {currentStep === 0 && <PartOne />}
              {currentStep === 1 && <PartTwo />}
              {currentStep === 2 && <PartThree />}
            </>
          )}
        </RegistrationFormConsumer>
      </form>
    </RegistrationFormProvider>
  );
}

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

export enum RegistrationFormContextActionType {
  SUBMIT_PART_ONE,
  SUBMIT_PART_TWO,
  SUBMIT_PART_THREE,
  PREVIOUS_STEP,
}

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
export type RegistrationFormPartOneState = Pick<RegistrationFormState, 'firstName' | 'lastName' | 'dateOfBirth'>;
export type RegistrationFormPartTwoState = Pick<RegistrationFormState, 'username' | 'password' | 'passwordConfirm'>;
export type RegistrationFormPartThreeState = Pick<RegistrationFormState, 'email' | 'hasAcceptedTermsAndConditions'>;
type RegistrationFormAction =
  | { type: RegistrationFormContextActionType.SUBMIT_PART_ONE; payload: RegistrationFormPartOneState }
  | { type: RegistrationFormContextActionType.SUBMIT_PART_TWO; payload: RegistrationFormPartTwoState }
  | { type: RegistrationFormContextActionType.SUBMIT_PART_THREE; payload: RegistrationFormPartThreeState }
  | { type: RegistrationFormContextActionType.PREVIOUS_STEP; payload: Partial<RegistrationFormState> };

export { useRegistrationFormContext };
