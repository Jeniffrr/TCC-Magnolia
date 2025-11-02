import type { FormData, ValidationRules } from '../types/Register.types';
import { VALIDATION_MESSAGES } from '../pages/Resgister/components/Register.constants';

export const validationRules: ValidationRules = {
  hospital_nome: (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('Nome do hospital');
    if (value.length > 255) return VALIDATION_MESSAGES.MAX_LENGTH(255);
    return "";
  },
  
  cnpj: (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('CNPJ');
    if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value))
      return "CNPJ deve estar no formato 00.000.000/0000-00";
    return "";
  },
  
  hospital_endereco: (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('Endereço do hospital');
    return "";
  },
  
  cnes: (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('CNES');
    return "";
  },
  
  usuario_nome: (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('Nome do usuário');
    if (value.length > 255) return VALIDATION_MESSAGES.MAX_LENGTH(255);
    return "";
  },
  
  email: (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('Email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return VALIDATION_MESSAGES.EMAIL_INVALID;
    return "";
  },
  
  usuario_cpf: (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('CPF');
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value))
      return "CPF deve estar no formato 000.000.000-00";
    return "";
  },
  
  senha: (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('Senha');
    if (value.length < 8) return VALIDATION_MESSAGES.PASSWORD_MIN;
    return "";
  },
  
  senha_confirmation: (value: string, formData?: FormData) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED('Confirmação de senha');
    if (formData && value !== formData.senha) return VALIDATION_MESSAGES.PASSWORDS_MISMATCH;
    return "";
  },
  
  consentimento_lgpd: (value: string | boolean) => {
    if (!value) return 'É obrigatório aceitar os termos da LGPD';
    return "";
  },
};

export const applyCnpjMask = (value: string): string => {
  const digits = value.replace(/\D/g, "").substring(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

export const applyCpfMask = (value: string): string => {
  const digits = value.replace(/\D/g, "").substring(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
};

export const handleApiErrors = (errorData: { errors?: Record<string, string[]> }): Record<string, string> => {
  const apiErrors: Record<string, string> = {};
  
  if (errorData.errors) {
    Object.entries(errorData.errors).forEach(([key, messages]) => {
      apiErrors[key] = (messages as string[])[0];
    });
  }
  
  return apiErrors;
};