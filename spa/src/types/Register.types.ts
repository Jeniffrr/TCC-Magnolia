export interface FormData {
  hospital_nome: string;
  cnpj: string;
  hospital_endereco: string;
  cnes: string;
  usuario_nome: string;
  email: string;
  usuario_cpf: string;
  senha: string;
  senha_confirmation: string;
  consentimento_lgpd: boolean;
}

export interface Errors {
  [key: string]: string | undefined;
}

export interface ApiErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
}

export interface ValidationRules {
  [key: string]: (value: string, formData?: FormData) => string;
}

export interface RegisterProps {
  onRegisterSuccess: () => void;
}