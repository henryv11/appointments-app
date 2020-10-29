import { useEffect, useRef, useState } from 'react';
import { FieldName, useForm } from 'react-hook-form';

export function useMultiStepForm<T>({ steps }: { steps: number }) {
  const [activeStep, setActiveStep] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const [isFirstClickDone, setIsFirstClickDone] = useState(false);
  const registeredFields = useRef<Set<FieldName<T>>[]>([]);
  const form = useForm<T>({ shouldUnregister: false, mode: 'onChange' });

  const getActiveFields = () => Array.from(registeredFields.current[activeStep] || []) as (keyof T)[];

  const register: typeof form.register = function () {
    const fn = form.register.apply(form, arguments);
    return function () {
      const name = arguments[0]?.name;
      if (name)
        registeredFields.current[activeStep]
          ? registeredFields.current[activeStep].add(name)
          : (registeredFields.current[activeStep] = new Set([name]));
      return fn.apply(form, arguments);
    };
  };

  useEffect(() => {
    setIsFirstClickDone(false);
    return () => form.clearErrors();
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
    isNextButtonDisabled: isFirstClickDone && !canContinue,
    isPreviousButtonVisible: activeStep > 0,
    isNextButtonVisible: activeStep < steps - 1,
    isSubmitButtonVisible: activeStep === steps - 1,
    nextStep: () =>
      form
        .trigger(getActiveFields() as FieldName<T>[])
        .then(isValid => (setActiveStep(isValid ? activeStep + 1 : activeStep), setIsFirstClickDone(true))),
    previousStep: () => setActiveStep(activeStep - 1),
  };
}
