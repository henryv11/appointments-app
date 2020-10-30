import { useEffect, useRef, useState } from 'react';
import { FieldName, useForm } from 'react-hook-form';

interface StepState<T> {
  registeredFields: Set<FieldName<T>>;
  isFirstErrorShown: boolean;
}

export function useMultiStepForm<T>({ steps }: { steps: number }) {
  const [activeStep, setActiveStep] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const [isNextButtonClicked, setIsNextButtonClicked] = useState(false);
  const stepStateRef = useRef<StepState<T>[]>([]);
  const form = useForm<T>({ shouldUnregister: false, mode: 'onChange' });

  const registerField = (name: FieldName<T>) => void stepStateRef.current[activeStep]?.registeredFields.add(name);

  const getActiveFields = () => Array.from(stepStateRef.current[activeStep]?.registeredFields || []) as (keyof T)[];

  const register: typeof form.register = (...args: any[]) => {
    if (args[0]?.name) return registerField(args[0].name), form.register.apply(form, args);
    const fn = form.register.apply(form, args);
    return (...args: any[]) => {
      if (args[0]?.name) registerField(args[0].name);
      return fn.apply(form, args);
    };
  };

  useEffect(() => {
    if (!stepStateRef.current[activeStep])
      stepStateRef.current[activeStep] = { registeredFields: new Set(), isFirstErrorShown: false };
    setIsNextButtonClicked(stepStateRef.current[activeStep].isFirstErrorShown);
  }, [activeStep]);

  useEffect(() => {
    const activeFields = getActiveFields();
    const values = form.getValues(activeFields);
    const errors = form.formState.errors;
    setCanContinue(activeFields.every(field => !!values[field] && !errors[field]));
  });

  return {
    ...form,
    register,
    activeStep,
    isNextButtonDisabled: isNextButtonClicked && !canContinue,
    isPreviousButtonVisible: activeStep > 0,
    isNextButtonVisible: activeStep < steps - 1,
    isSubmitButtonVisible: activeStep === steps - 1,
    nextStep: () =>
      form
        .trigger(getActiveFields() as FieldName<T>[])
        .then(
          isValid => (
            setActiveStep(isValid ? activeStep + 1 : activeStep),
            (stepStateRef.current[activeStep].isFirstErrorShown = true)
          ),
        ),
    previousStep: () => setActiveStep(activeStep - 1),
  };
}
