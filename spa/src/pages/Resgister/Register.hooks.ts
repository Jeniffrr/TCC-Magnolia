import { useState, useCallback } from "react";
import type { FormData, Errors } from './Register.types';
import { INITIAL_FORM_DATA } from './Register.constants';
import { validationRules, applyCnpjMask, applyCpfMask } from './Register.utils';

export const useRegisterForm = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  }, []);

  const validateField = useCallback((name: string, value: string): string => {
    const rule = validationRules[name as keyof typeof validationRules];
    if (!rule) return "";
    
    return rule(value, formData);
  }, [formData]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField]);

  const handleInputMask = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "cnpj") {
      newValue = applyCnpjMask(value);
    } else if (name === "usuario_cpf") {
      newValue = applyCpfMask(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  }, []);

  const handleClear = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setShowSuccess(false);
  }, []);

  const validateForm = useCallback((): Errors => {
    const newErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  }, [formData, validateField]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    showSuccess,
    setShowSuccess,
    handleChange,
    handleBlur,
    handleInputMask,
    handleClear,
    validateForm,
  };
};