
import { useState } from 'react';
import { z } from 'zod';

export const useFormValidation = <T extends z.ZodTypeAny>(schema: T) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): data is z.infer<T> => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    validate,
    errors,
    getFieldError,
    clearErrors,
  };
};
