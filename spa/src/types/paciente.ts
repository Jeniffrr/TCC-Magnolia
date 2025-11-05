// Tipos TypeScript para Pacientes

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
  desfecho?: unknown;
  alta?: unknown;
}