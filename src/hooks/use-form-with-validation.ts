import { useCallback, useState } from 'react';

import { validators } from '@utils/validators';

type TFormValues = Record<string, string>;
type TFormValidity<T extends TFormValues> = Record<keyof T, boolean>;

export type TUseFormWithValidation<T extends TFormValues> = {
  values: T;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validity: TFormValidity<T>;
  isValid: boolean;
  resetForm: (nextValues?: T) => void;
};

const validateForm = <T extends TFormValues>(formValues: T): TFormValidity<T> => {
  const nextValidity = {} as TFormValidity<T>;

  for (const fieldName of Object.keys(formValues) as (keyof T & string)[]) {
    const normalizedValue = formValues[fieldName].trim();
    nextValidity[fieldName] =
      normalizedValue !== '' &&
      (validators[fieldName]?.validator(normalizedValue) ?? true);
  }

  return nextValidity;
};

export const useFormWithValidation = <T extends TFormValues>(
  initialValues: T
): TUseFormWithValidation<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [validity, setValidity] = useState<TFormValidity<T>>(() =>
    validateForm(initialValues)
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };

    setValues(nextValues);
    setValidity(validateForm(nextValues));
  };

  const resetForm = useCallback(
    (nextValues: T = initialValues): void => {
      setValues(nextValues);
      setValidity(validateForm(nextValues));
    },
    [initialValues]
  );

  const isValid = Object.values<boolean>(validity).every(Boolean);

  return { values, handleChange, validity, isValid, resetForm };
};
