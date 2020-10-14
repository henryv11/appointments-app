import { useEffect, useRef, useState } from 'react';
import { FieldName, useForm } from 'react-hook-form';

export function useMultiStepForm<T>({ steps }: { steps: number }) {
  const form = useForm<T>({ shouldUnregister: false, mode: 'onChange' });
  const [activeStep, setActivePart] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const registeredFields = useRef<Set<FieldName<T>>[]>([]);

  useEffect(() => {
    const activeFields = Array.from(registeredFields.current[activeStep] || []) as (keyof T)[];
    const values = form.getValues(activeFields);
    setCanContinue(!activeFields.some(field => !values[field] || form.errors[field]));
  });

  const register: typeof form.register = function () {
    const fn = form.register.apply(null, arguments);
    return function () {
      const name = arguments[0]?.name;
      if (name)
        registeredFields.current[activeStep]
          ? registeredFields.current[activeStep].add(name)
          : (registeredFields.current[activeStep] = new Set([name]));
      return fn.apply(null, arguments);
    };
  };

  return {
    ...form,
    register,
    activeStep,
    isNextButtonDisabled: !canContinue,
    isPreviousButtonVisible: activeStep > 0,
    isNextButtonVisible: activeStep < steps - 1,
    isSubmitButtonVisible: activeStep === steps - 1,
    nextStep() {
      form
        .trigger(Array.from(registeredFields.current[activeStep] || []))
        .then(isValid => isValid && setActivePart(activeStep + 1));
    },
    previousStep() {
      setActivePart(activeStep - 1);
    },
  };
}
