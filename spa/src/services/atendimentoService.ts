import api from '../api/axios';

// ========== INTERFACES ==========
interface AtendimentoData {
  pressao_sistolica?: number;
  pressao_diastolica?: number;
  frequencia_cardiaca?: number;
  temperatura?: number;
  frequencia_respiratoria?: number;
  evolucao_maternidade?: string;
  avaliacao_fetal?: string;
  bcf?: number;
  movimentos_fetais_presentes?: boolean;
  altura_uterina?: number;
  exames_laboratoriais?: Array<{
    nome: string;
    resultado: string;
    data_exame: string;
  }>;
  medicamentos_administrados?: Array<{
    nome_medicacao: string;
    dosagem: string;
    frequencia: string;
  }>;
  procedimentos_realizados?: Array<{
    nome_procedimento: string;
    descricao?: string;
    data_procedimento: string;
  }>;
}

interface AtendimentoUpdateData {
  categoria_risco_id?: number;
  pressao_sistolica?: number;
  pressao_diastolica?: number;
  frequencia_cardiaca?: number;
  temperatura?: number;
  evolucao_maternidade?: string;
  avaliacao_fetal?: string;
}

// ========== EXAMES LABORATORIAIS ==========
export const examesService = {
  // Lista exames de um atendimento
  getByAtendimento: (atendimentoId: number) => 
    api.get(`/api/atendimentos/${atendimentoId}/exames`),
  
  // Adiciona exame a um atendimento
  create: (atendimentoId: number, data: {
    nome: string;
    resultado: string;
    data_exame: string;
  }) => api.post(`/api/atendimentos/${atendimentoId}/exames`, data),
  
  // Atualiza exame
  update: (atendimentoId: number, exameId: number, data: {
    nome?: string;
    resultado?: string;
    data_exame?: string;
  }) => api.put(`/api/atendimentos/${atendimentoId}/exames/${exameId}`, data),
  
  // Remove exame
  delete: (atendimentoId: number, exameId: number) => 
    api.delete(`/api/atendimentos/${atendimentoId}/exames/${exameId}`)
};

// ========== MEDICAMENTOS ADMINISTRADOS ==========
export const medicamentosService = {
  // Lista medicamentos de um atendimento
  getByAtendimento: (atendimentoId: number) => 
    api.get(`/api/atendimentos/${atendimentoId}/medicamentos`),
  
  // Adiciona medicamento a um atendimento
  create: (atendimentoId: number, data: {
    nome_medicacao: string;
    dosagem: string;
    frequencia: string;
  }) => api.post(`/api/atendimentos/${atendimentoId}/medicamentos`, data),
  
  // Atualiza medicamento
  update: (atendimentoId: number, medicamentoId: number, data: {
    nome_medicacao?: string;
    dosagem?: string;
    frequencia?: string;
  }) => api.put(`/api/atendimentos/${atendimentoId}/medicamentos/${medicamentoId}`, data),
  
  // Remove medicamento
  delete: (atendimentoId: number, medicamentoId: number) => 
    api.delete(`/api/atendimentos/${atendimentoId}/medicamentos/${medicamentoId}`)
};

// ========== PROCEDIMENTOS REALIZADOS ==========
export const procedimentosService = {
  // Lista procedimentos de um atendimento
  getByAtendimento: (atendimentoId: number) => 
    api.get(`/api/atendimentos/${atendimentoId}/procedimentos`),
  
  // Adiciona procedimento a um atendimento
  create: (atendimentoId: number, data: {
    nome_procedimento: string;
    descricao?: string;
    data_procedimento: string;
  }) => api.post(`/api/atendimentos/${atendimentoId}/procedimentos`, data),
  
  // Atualiza procedimento
  update: (atendimentoId: number, procedimentoId: number, data: {
    nome_procedimento?: string;
    descricao?: string;
    data_procedimento?: string;
  }) => api.put(`/api/atendimentos/${atendimentoId}/procedimentos/${procedimentoId}`, data),
  
  // Remove procedimento
  delete: (atendimentoId: number, procedimentoId: number) => 
    api.delete(`/api/atendimentos/${atendimentoId}/procedimentos/${procedimentoId}`)
};

// ========== OCORRÊNCIAS CLÍNICAS ==========
export const ocorrenciasService = {
  // Lista ocorrências de um atendimento
  getByAtendimento: (atendimentoId: number) => 
    api.get(`/api/atendimentos/${atendimentoId}/ocorrencias`),
  
  // Adiciona ocorrência a um atendimento
  create: (atendimentoId: number, data: {
    descricao: string;
    data_ocorrencia: string;
  }) => api.post(`/api/atendimentos/${atendimentoId}/ocorrencias`, { ...data, atendimento_id: atendimentoId }),
  
  // Atualiza ocorrência
  update: (ocorrenciaId: number, data: {
    descricao?: string;
    data_ocorrencia?: string;
  }) => api.put(`/api/ocorrencias-clinicas/${ocorrenciaId}`, data),
  
  // Remove ocorrência
  delete: (ocorrenciaId: number) => 
    api.delete(`/api/ocorrencias-clinicas/${ocorrenciaId}`)
};

// ========== ATENDIMENTOS ==========
export const atendimentosService = {
  // Lista atendimentos de uma internação
  getByInternacao: (internacaoId: number) => 
    api.get(`/api/internacoes/${internacaoId}/atendimentos`),
  
  // Cria novo atendimento para internação
  createForInternacao: (internacaoId: number, data: AtendimentoData) => 
    api.post(`/api/internacoes/${internacaoId}/atendimentos`, data),
  
  // Exibe atendimento específico
  show: (atendimentoId: number) => 
    api.get(`/api/atendimentos/${atendimentoId}`),
  
  // Atualiza atendimento
  update: (atendimentoId: number, data: AtendimentoUpdateData) => 
    api.put(`/api/atendimentos/${atendimentoId}`, data),
  
  // Remove atendimento
  delete: (atendimentoId: number) => 
    api.delete(`/api/atendimentos/${atendimentoId}`)
};