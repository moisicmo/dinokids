import { useEffect, useMemo, useState } from 'react';

/**
 * Utility for numeric/decimal inputs without type="number".
 * Spread directly onto InputCustom: <InputCustom {...numericProps(val, set)} />
 */
export const numericProps = (
  value: string | number,
  onChange: (val: string) => void,
  decimals = 2,
) => ({
  inputMode: (decimals === 0 ? 'numeric' : 'decimal') as 'numeric' | 'decimal',
  value: String(value),
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    const ok = decimals === 0 ? /^\d*$/ : new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`);
    if (ok.test(val) || val === '') onChange(val);
  },
  onBlur: () => {
    const num = parseFloat(String(value));
    if (!isNaN(num)) {
      onChange(decimals === 0 ? String(Math.round(num)) : num.toFixed(decimals));
    }
  },
});

export const useForm = (initialForm: any = {}, formValidations: any = {}) => {
  const [formState, setFormState] = useState({ ...initialForm });
  const [formValidation, setFormValidation] = useState<any>({});

  useEffect(() => {
    createValidators();
  }, [formState]);

  useEffect(() => {
    setFormState({ ...initialForm });
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    const checkValidity = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (!checkValidity(obj[key])) return false;
        } else {
          if (obj[key] !== null) return false;
        }
      }
      return true;
    };

    return checkValidity(formValidation);
  }, [formValidation]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prevState: any) => setNestedValue(prevState, name, value));
  };

  const isSelectChange = (name: string, text: string) => {
    setFormState({
      ...formState,
      [name]: text
    });
  };

  const onFileChange = (name: string, file: File) => {
    setFormState({
      ...formState,
      [name]: file
    });
  };

  const onSwitchChange = (name: string, state: boolean) => {
    setFormState({
      ...formState,
      [name]: state
    });
  };

  const onArrayChange = (name: string, state: Array<any>) => {
    setFormState({
      ...formState,
      [name]: state
    });
  };

  const onValueChange = (name: string, value: any) => {
    setFormState((prevState: any) => setNestedValue(prevState, name, value));
  };

  /**
   * For useForm-managed decimal fields. Returns {onChange, onBlur, inputMode}.
   * Usage: <InputCustom name="price" value={price} {...onDecimalChange('price')} />
   */
  const onDecimalChange = (name: string, decimals = 2) => ({
    inputMode: (decimals === 0 ? 'numeric' : 'decimal') as 'numeric' | 'decimal',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      const ok = decimals === 0 ? /^\d*$/ : new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`);
      if (ok.test(val) || val === '') onValueChange(name, val);
    },
    onBlur: () => {
      const num = parseFloat(getNestedValue(formState, name));
      if (!isNaN(num)) {
        onValueChange(name, decimals === 0 ? String(Math.round(num)) : num.toFixed(decimals));
      }
    },
  });

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const updated = { ...obj };
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return updated;
  };

  const createValidators = () => {
    const buildValidation = (state: any, validations: any) => {
      const result: any = {};
      
      for (const key in validations) {
        const validation = validations[key];
        
        // Si es una validación de array (como sessions: [(fn), 'mensaje'])
        if (Array.isArray(validation) && validation.length === 2) {
          const [fn, message] = validation;
          // Aplicar la validación al valor completo del campo
          result[`${key}Valid`] = fn(state[key], state) ? null : message;
        }
        // Si es un objeto anidado (validaciones para propiedades de un objeto)
        else if (typeof validation === 'object' && validation !== null) {
          result[`${key}Valid`] = buildValidation(state[key] ?? {}, validation);
        }
        // Caso por defecto
        else {
          const [fn, message] = validation;
          result[`${key}Valid`] = fn(state[key], state) ? null : message;
        }
      }
      return result;
    };

    setFormValidation(buildValidation(formState, formValidations));
  };

  return {
    ...formState,
    formState,
    ...formValidation,
    onInputChange,
    isSelectChange,
    onFileChange,
    onSwitchChange,
    onArrayChange,
    onValueChange,
    onDecimalChange,
    onResetForm,
    isFormValid,
  };
};