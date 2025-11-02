import type { FormData } from '../../../types/Register.types';

export const INITIAL_FORM_DATA: FormData = {
  hospital_nome: "",
  cnpj: "",
  hospital_endereco: "",
  cnes: "",
  usuario_nome: "",
  email: "",
  usuario_cpf: "",
  senha: "",
  senha_confirmation: "",
  consentimento_lgpd: false,
};

export const BREADCRUMB_ITEMS = [
  { label: "", url: "/" },
  { label: "Registrar", active: true },
];

export const API_ENDPOINTS = {
  REGISTER: 'http://localhost:8000/api/primeiro-acesso/registrar'
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} é obrigatório`,
  MAX_LENGTH: (max: number) => `Deve ter no máximo ${max} caracteres`,
  EMAIL_INVALID: "Email inválido",
  PASSWORD_MIN: "Senha deve ter pelo menos 8 caracteres",
  PASSWORDS_MISMATCH: "As senhas não coincidem"
};