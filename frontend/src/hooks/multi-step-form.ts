import { useEffect, useRef, useState } from 'react';
import { FieldName, useForm } from 'react-hook-form';

export function useMultiStepForm<T>({ steps }: { steps: number }) {
  const form = useForm<T>({ shouldUnregister: false, mode: 'onChange' });
  const [activePart, setActivePart] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const registeredFields = useRef<Set<FieldName<T>>[]>([]);

  useEffect(() => {
    const activeFields = Array.from(registeredFields.current[activePart] || []) as (keyof T)[];
    const values = form.getValues(activeFields);
    setCanContinue(activeFields.every(field => !!values[field] && !form.errors[field]));
  });

  const register: typeof form.register = function () {
    const fn = form.register.apply(null, arguments);
    return function () {
      const name = arguments[0]?.name;
      name &&
        (registeredFields.current[activePart]
          ? registeredFields.current[activePart].add(name)
          : (registeredFields.current[activePart] = new Set([name])));
      return fn.apply(null, arguments);
    };
  };

  return {
    ...form,
    register,
    activePart,
    isNextButtonDisabled: !canContinue,
    isPreviousButtonVisible: activePart > 0,
    isNextButtonVisible: activePart < steps - 1,
    isSubmitButtonVisible: activePart === steps - 1,
    nextPart() {
      form
        .trigger(Array.from(registeredFields.current[activePart] || []))
        .then(isValid => isValid && setActivePart(activePart + 1));
    },
    previousPart() {
      setActivePart(activePart - 1);
    },
  };
}
