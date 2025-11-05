import api from '../api/axios';

export interface Paciente {
  id: number;
  nome_completo: string;
  cpf: string;
  nome_mae: string;
  data_nascimento: string;
  telefone: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  alergias?: string;
  medicamentos_continuos?: string;
  consentimento_lgpd_aceito: boolean;
  created_at: string;
  updated_at: string;
}

export interface PacienteResumo {
  id: number;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  internacoes_ativas?: Array<{
    id: number;
    leito?: { nome: string };
    status: string;
  }>;
}

export interface PacienteCompleto {
  id: number;
  nome_completo: string;
  cpf: string;
  nome_mae: string;
  data_nascimento: string;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  alergias: string;
  medicamentos_continuos: string;
  consentimento_lgpd_aceito: boolean;
  data_consentimento_lgpd: string;
  condicoes_patologicas: Array<{ id: number; nome: string }>;
  gestacoes_anteriores: Array<{ id: number; ano_parto: string; tipo_parto: string; observacoes?: string }>;
}

export interface InternacaoProntuario {
  id: number;
  status: string;
  motivo_internacao: string;
  data_entrada: string;
  paciente: PacienteCompleto;
  leito: { id: number; nome: string } | null;
  atendimentos: Array<{
    id: number;
    data_hora: string;
    evolucao_maternidade: string;
    avaliacao_fetal?: string;
    frequencia_cardiaca?: number;
    pressao_sistolica?: number;
    pressao_diastolica?: number;
    temperatura?: number;
    frequencia_respiratoria?: number;
    bcf?: number;
    movimentos_fetais_presentes?: boolean;
    altura_uterina?: number;
  }>;
  desfecho?: {
    id: number;
    data_desfecho: string;
    tipo_desfecho: string;
    observacoes?: string;
  };
  alta?: {
    id: number;
    data_alta: string;
    motivo_alta: string;
    observacoes?: string;
  };
}

export interface CreatePacienteData {
  nome_completo: string;
  cpf: string;
  nome_mae: string;
  data_nascimento: string;
  telefone: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  alergias?: string;
  medicamentos_continuos?: string;
  consentimento_lgpd_aceito: boolean;
  leito_id: number;
  motivo_internacao: string;
  condicoes_patologicas?: number[];
}

export interface PacientesPaginatedResponse {
  data: Paciente[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const getPacientes = async (page: number = 1): Promise<PacientesPaginatedResponse> => {
  const response = await api.get(`/api/pacientes?page=${page}`);
  return response.data;
};

export const createPaciente = async (data: CreatePacienteData): Promise<Paciente> => {
  const response = await api.post('/api/pacientes', data);
  return response.data;
};

export const updatePaciente = async (id: number, data: Partial<CreatePacienteData>): Promise<Paciente> => {
  const response = await api.put(`/api/pacientes/${id}`, data);
  return response.data;
};

export const getPaciente = async (id: number): Promise<Paciente> => {
  const response = await api.get(`/api/pacientes/${id}`);
  return response.data;
};

export const getPacienteAtendimentos = async (id: number) => {
  const response = await api.get(`/api/pacientes/${id}/atendimentos`);
  return response.data;
};