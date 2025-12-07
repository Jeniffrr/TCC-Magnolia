import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, BrButton } from '@govbr-ds/react-components';
import AppLayout from '../../../../components/Layout/AppLayout';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import BrInputIcon from '../../../../components/BrInputIcon/BrInputIcon';
import { pageStyles, getFieldStatus, getFeedbackText } from '../../../../assets/style/pageStyles';
import { Loading } from '../../../../components/Loading/Loading';
import api from '../../../../api/axios';
import { atendimentosService } from '../../../../services/atendimentoService';
import { logger, performanceMonitor } from '../../../../utils/logger';
import '../../GerenciarPacientes/style.css';

interface Paciente {
  id: number;
  nome_completo: string;
  cpf: string;
}

interface ExameLaboratorial {
  nome: string;
  resultado: string;
  data_exame: string;
}

interface MedicamentoAdministrado {
  nome_medicacao: string;
  dosagem: string;
  frequencia: string;
}

interface ProcedimentoRealizado {
  nome_procedimento: string;
  descricao: string;
  data_procedimento: string;
}

interface OcorrenciaClinica {
  descricao: string;
  data_ocorrencia: string;
}

const NovoAtendimento: React.FC = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [formData, setFormData] = useState({
    pressao_sistolica: '',
    pressao_diastolica: '',
    frequencia_cardiaca: '',
    temperatura: '',
    frequencia_respiratoria: '',
    evolucao_maternidade: '',
    avaliacao_fetal: '',
    bcf: '',
    movimentos_fetais_presentes: false,
    altura_uterina: '',
    exames_laboratoriais: [] as ExameLaboratorial[],
    medicamentos_administrados: [] as MedicamentoAdministrado[],
    procedimentos_realizados: [] as ProcedimentoRealizado[],
    ocorrencias_clinicas: [] as OcorrenciaClinica[]
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      logger.info('Carregando dados para novo atendimento', 'NovoAtendimento', { pacienteId });
      performanceMonitor.start('carregarPaciente');
      
      const pacienteRes = await api.get(`/api/pacientes/${pacienteId}`);
      setPaciente(pacienteRes.data);
      
      performanceMonitor.end('carregarPaciente', 'NovoAtendimento');
      logger.info('Dados carregados', 'NovoAtendimento', { pacienteNome: pacienteRes.data.nome_completo });
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      logger.error('Erro ao carregar dados do paciente', err, 'NovoAtendimento');
      
      if (error.response?.status === 404) {
        setApiError('Paciente não encontrado');
      } else if (error.response?.status === 401) {
        setApiError('Sessão expirada. Faça login novamente');
      } else {
        setApiError(error.response?.data?.message || 'Erro ao carregar dados do paciente');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'pressao_sistolica' || name === 'pressao_diastolica' || name === 'frequencia_cardiaca' || name === 'frequencia_respiratoria' || name === 'bcf' || name === 'altura_uterina') {
      maskedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'temperatura') {
      maskedValue = value.replace(/[^0-9.]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };

  const addExame = () => {
    setFormData(prev => ({
      ...prev,
      exames_laboratoriais: [...prev.exames_laboratoriais, { nome: '', resultado: '', data_exame: new Date().toISOString().split('T')[0] }]
    }));
  };

  const removeExame = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exames_laboratoriais: prev.exames_laboratoriais.filter((_, i) => i !== index)
    }));
  };

  const updateExame = (index: number, field: keyof ExameLaboratorial, value: string) => {
    setFormData(prev => ({
      ...prev,
      exames_laboratoriais: prev.exames_laboratoriais.map((exame, i) => 
        i === index ? { ...exame, [field]: value } : exame
      )
    }));
  };

  const addMedicamento = () => {
    setFormData(prev => ({
      ...prev,
      medicamentos_administrados: [...prev.medicamentos_administrados, { nome_medicacao: '', dosagem: '', frequencia: '' }]
    }));
  };

  const removeMedicamento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicamentos_administrados: prev.medicamentos_administrados.filter((_, i) => i !== index)
    }));
  };

  const updateMedicamento = (index: number, field: keyof MedicamentoAdministrado, value: string) => {
    setFormData(prev => ({
      ...prev,
      medicamentos_administrados: prev.medicamentos_administrados.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const addProcedimento = () => {
    setFormData(prev => ({
      ...prev,
      procedimentos_realizados: [...prev.procedimentos_realizados, { nome_procedimento: '', descricao: '', data_procedimento: new Date().toISOString().split('T')[0] }]
    }));
  };

  const removeProcedimento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      procedimentos_realizados: prev.procedimentos_realizados.filter((_, i) => i !== index)
    }));
  };

  const updateProcedimento = (index: number, field: keyof ProcedimentoRealizado, value: string) => {
    setFormData(prev => ({
      ...prev,
      procedimentos_realizados: prev.procedimentos_realizados.map((proc, i) => 
        i === index ? { ...proc, [field]: value } : proc
      )
    }));
  };

  const addOcorrencia = () => {
    setFormData(prev => ({
      ...prev,
      ocorrencias_clinicas: [...prev.ocorrencias_clinicas, { descricao: '', data_ocorrencia: new Date().toISOString().split('T')[0] }]
    }));
  };

  const removeOcorrencia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ocorrencias_clinicas: prev.ocorrencias_clinicas.filter((_, i) => i !== index)
    }));
  };

  const updateOcorrencia = (index: number, field: keyof OcorrenciaClinica, value: string) => {
    setFormData(prev => ({
      ...prev,
      ocorrencias_clinicas: prev.ocorrencias_clinicas.map((ocor, i) => 
        i === index ? { ...ocor, [field]: value } : ocor
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setValidationErrors({});

    const errors: Record<string, string> = {};
    if (!formData.evolucao_maternidade?.trim()) errors.evolucao_maternidade = 'Campo obrigatório';
    if (!formData.avaliacao_fetal?.trim()) errors.avaliacao_fetal = 'Campo obrigatório';
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setApiError('Preencha os campos obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const internacoesRes = await api.get(`/api/internacoes?status=ativa&paciente_id=${pacienteId}`);
      const internacao = internacoesRes.data[0];
      
      if (!internacao) {
        throw new Error('Paciente não possui internação ativa');
      }

      const atendimentoData = {
        pressao_sistolica: formData.pressao_sistolica ? parseInt(formData.pressao_sistolica) : undefined,
        pressao_diastolica: formData.pressao_diastolica ? parseInt(formData.pressao_diastolica) : undefined,
        frequencia_cardiaca: formData.frequencia_cardiaca ? parseInt(formData.frequencia_cardiaca) : undefined,
        temperatura: formData.temperatura ? parseFloat(formData.temperatura) : undefined,
        frequencia_respiratoria: formData.frequencia_respiratoria ? parseInt(formData.frequencia_respiratoria) : undefined,
        evolucao_maternidade: formData.evolucao_maternidade || undefined,
        avaliacao_fetal: formData.avaliacao_fetal || undefined,
        bcf: formData.bcf ? parseInt(formData.bcf) : undefined,
        movimentos_fetais_presentes: formData.movimentos_fetais_presentes,
        altura_uterina: formData.altura_uterina ? parseInt(formData.altura_uterina) : undefined,
        exames_laboratoriais: formData.exames_laboratoriais.filter(e => e.nome.trim()),
        medicamentos_administrados: formData.medicamentos_administrados.filter(m => m.nome_medicacao.trim()),
        procedimentos_realizados: formData.procedimentos_realizados.filter(p => p.nome_procedimento.trim())
      };
      performanceMonitor.start('salvarAtendimento');
      await atendimentosService.createForInternacao(internacao.id, atendimentoData);
      performanceMonitor.end('salvarAtendimento', 'NovoAtendimento');
      
      logger.info('Atendimento registrado com sucesso', 'NovoAtendimento', { 
        pacienteId, 
        internacaoId: internacao.id 
      });
      
      setShowSuccess(true);
      setTimeout(() => navigate('/profissionais/'), 2000);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { errors?: Record<string, string[]>; message?: string } } };
      if (error.response && error.response.status === 422) {
        const errors = error.response.data?.errors || {};
        const flatErrors: Record<string, string> = {};
        Object.keys(errors).forEach(key => {
          flatErrors[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
        });
        setValidationErrors(flatErrors);
        setApiError('Formulário contém erros. Verifique os campos.');
      } else {
        setApiError(error.response?.data?.message || 'Ocorreu um erro ao salvar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const BREADCRUMB_ITEMS = [
    { label: "", url: "/profissionais" },
    { label: "Novo Atendimento", active: true },
  ];

  return (
    <AppLayout>
      <Container fluid>
        <div className="mb-3 mt-3">
          <Breadcrumb
            items={BREADCRUMB_ITEMS}
            homeIcon={true}
            className="custom-breadcrumb"
          />
        </div>
        
        <h1 style={pageStyles.title}>
          Novo Atendimento{paciente ? ` - ${paciente.nome_completo}` : ''}
        </h1>
        
        <div style={pageStyles.containerPadding}>
          {!paciente ? (
            <Loading message="Carregando dados da paciente..." />
          ) : (
          <>
          {showSuccess && (
            <div className="alert-card success">
              <i className="fas fa-check-circle"></i>
              Atendimento registrado com sucesso!
            </div>
          )}

          {apiError && (
            <div className="alert-card error">
              <i className="fas fa-exclamation-triangle"></i>
              {apiError}
            </div>
          )}

          <div className="register-container">
            <form onSubmit={handleSubmit} noValidate>
              {/* Sinais Vitais */}
              <h3 style={pageStyles.sectionTitle}>Sinais Vitais</h3>
              <hr />

              <div className="vitals-grid">
                <div className="vital-field">
                  <BrInputIcon
                    label="Pressão Sistólica"
                    name="pressao_sistolica"
                    type="text"
                    value={formData.pressao_sistolica}
                    onChange={handleInputChange}
                    icon="fas fa-heartbeat"
                    status={getFieldStatus(validationErrors.pressao_sistolica)}
                    feedbackText={getFeedbackText(validationErrors.pressao_sistolica)}
                  />
                  <span className="unit-label">mmHg</span>
                </div>
                <div className="vital-field">
                  <BrInputIcon
                    label="Pressão Diastólica"
                    name="pressao_diastolica"
                    type="text"
                    value={formData.pressao_diastolica}
                    onChange={handleInputChange}
                    icon="fas fa-heartbeat"
                    status={getFieldStatus(validationErrors.pressao_diastolica)}
                    feedbackText={getFeedbackText(validationErrors.pressao_diastolica)}
                  />
                  <span className="unit-label">mmHg</span>
                </div>
                <div className="vital-field">
                  <BrInputIcon
                    label="Frequência Cardíaca"
                    name="frequencia_cardiaca"
                    type="text"
                    value={formData.frequencia_cardiaca}
                    onChange={handleInputChange}
                    icon="fas fa-heart"
                    status={getFieldStatus(validationErrors.frequencia_cardiaca)}
                    feedbackText={getFeedbackText(validationErrors.frequencia_cardiaca)}
                  />
                  <span className="unit-label">bpm</span>
                </div>
              </div>

              <div className="vitals-grid">
                <div className="vital-field-wide">
                  <BrInputIcon
                    label="Temperatura"
                    name="temperatura"
                    type="text"
                    value={formData.temperatura}
                    onChange={handleInputChange}
                    icon="fas fa-thermometer-half"
                    status={getFieldStatus(validationErrors.temperatura)}
                    feedbackText={getFeedbackText(validationErrors.temperatura)}
                  />
                  <span className="unit-label">°C</span>
                </div>
                <div className="vital-field">
                  <BrInputIcon
                    label="Frequência Respiratória"
                    name="frequencia_respiratoria"
                    type="text"
                    value={formData.frequencia_respiratoria}
                    onChange={handleInputChange}
                    icon="fas fa-lungs"
                    status={getFieldStatus(validationErrors.frequencia_respiratoria)}
                    feedbackText={getFeedbackText(validationErrors.frequencia_respiratoria)}
                  />
                  <span className="unit-label">rpm</span>
                </div>
              </div>

              {/* Avaliação Obstétrica */}
              <h3 style={pageStyles.userSectionTitle}>Avaliação Obstétrica</h3>
              <hr />
              
              <div className="vitals-grid" style={{ marginBottom: '16px' }}>
                <div className="vital-field">
                  <BrInputIcon
                    label="BCF"
                    name="bcf"
                    type="text"
                    value={formData.bcf}
                    onChange={handleInputChange}
                    icon="fas fa-baby"
                    status={getFieldStatus(validationErrors.bcf)}
                    feedbackText={getFeedbackText(validationErrors.bcf)}
                  />
                  <span className="unit-label">bpm</span>
                </div>
                <div className="vital-field">
                  <BrInputIcon
                    label="Altura Uterina"
                    name="altura_uterina"
                    type="text"
                    value={formData.altura_uterina}
                    onChange={handleInputChange}
                    icon="fas fa-ruler"
                    status={getFieldStatus(validationErrors.altura_uterina)}
                    feedbackText={getFeedbackText(validationErrors.altura_uterina)}
                  />
                  <span className="unit-label">cm</span>
                </div>
              </div>

              <div className="checkbox-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="movimentos_fetais_presentes"
                    checked={formData.movimentos_fetais_presentes}
                    onChange={(e) => setFormData(prev => ({ ...prev, movimentos_fetais_presentes: e.target.checked }))}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Movimentos Fetais Presentes</span>
                </label>
              </div>

              {/* Evolução Clínica */}
              <h3 style={pageStyles.userSectionTitle}>Evolução Clínica</h3>
              <hr />

              <div className="vitals-grid" style={{ marginBottom: '16px' }}>
                <div className="textarea-field">
                  <label className="textarea-label">Evolução Maternidade*</label>
                  <textarea
                    name="evolucao_maternidade"
                    value={formData.evolucao_maternidade}
                    onChange={handleInputChange}
                    rows={4}
                    className="textarea-input"
                    placeholder="Descreva a evolução clínica da paciente..."
                  />
                  {validationErrors.evolucao_maternidade && (
                    <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                      {validationErrors.evolucao_maternidade}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="vitals-grid" style={{ marginBottom: '16px' }}>
                <div className="textarea-field">
                  <label className="textarea-label">Avaliação Fetal*</label>
                  <textarea
                    name="avaliacao_fetal"
                    value={formData.avaliacao_fetal}
                    onChange={handleInputChange}
                    rows={3}
                    className="textarea-input"
                    placeholder="Descreva a avaliação fetal..."
                  />
                  {validationErrors.avaliacao_fetal && (
                    <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                      {validationErrors.avaliacao_fetal}
                    </div>
                  )}
                </div>
              </div>

              {/* Exames Laboratoriais */}
              <h3 style={pageStyles.userSectionTitle}>Exames Laboratoriais</h3>
              <hr />

              <div style={{ marginBottom: '16px' }}>
                <div className="section-actions">
                  <label className="admissao-form-label">Exames Realizados</label>
                  <BrButton type="button" onClick={addExame} style={pageStyles.primaryButton}>Adicionar Exame</BrButton>
                </div>

                {formData.exames_laboratoriais.map((exame, index) => (
                  <div key={index} className="admissao-gestacao-card">
                    <div className="card-header">
                      <h4 className="admissao-gestacao-title">Exame {index + 1}</h4>
                      <button type="button" onClick={() => removeExame(index)} className="admissao-remove-button">Remover</button>
                    </div>

                    <div className="card-fields">
                      <div className="card-field-wide">
                        <label>Nome do Exame</label>
                        <input
                          type="text"
                          value={exame.nome}
                          onChange={(e) => updateExame(index, 'nome', e.target.value)}
                          placeholder="Ex: Hemograma, Glicemia"
                        />
                      </div>
                      <div className="card-field-wide">
                        <label>Resultado</label>
                        <input
                          type="text"
                          value={exame.resultado}
                          onChange={(e) => updateExame(index, 'resultado', e.target.value)}
                          placeholder="Ex: Normal, Alterado"
                        />
                      </div>
                      <div className="card-field">
                        <label>Data do Exame</label>
                        <input
                          type="date"
                          value={exame.data_exame}
                          onChange={(e) => updateExame(index, 'data_exame', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.exames_laboratoriais.length === 0 && (
                  <div className="empty-state">
                    Nenhum exame laboratorial cadastrado. Clique em "Adicionar Exame" para incluir.
                  </div>
                )}
              </div>

              {/* Medicamentos Administrados */}
              <h3 style={pageStyles.userSectionTitle}>Medicamentos Administrados</h3>
              <hr />

              <div style={{ marginBottom: '16px' }}>
                <div className="section-actions">
                  <label className="admissao-form-label">Medicações Aplicadas</label>
                  <BrButton type="button" onClick={addMedicamento} style={pageStyles.primaryButton}>Adicionar Medicamento</BrButton>
                </div>

                {formData.medicamentos_administrados.map((medicamento, index) => (
                  <div key={index} className="admissao-gestacao-card">
                    <div className="card-header">
                      <h4 className="admissao-gestacao-title">Medicamento {index + 1}</h4>
                      <button type="button" onClick={() => removeMedicamento(index)} className="admissao-remove-button">Remover</button>
                    </div>

                    <div className="card-fields">
                      <div className="card-field-wide">
                        <label>Nome da Medicação</label>
                        <input
                          type="text"
                          value={medicamento.nome_medicacao}
                          onChange={(e) => updateMedicamento(index, 'nome_medicacao', e.target.value)}
                          placeholder="Ex: Dipirona, Paracetamol"
                        />
                      </div>
                      <div className="card-field">
                        <label>Dosagem</label>
                        <input
                          type="text"
                          value={medicamento.dosagem}
                          onChange={(e) => updateMedicamento(index, 'dosagem', e.target.value)}
                          placeholder="Ex: 500mg, 1ml"
                        />
                      </div>
                      <div className="card-field">
                        <label>Frequência</label>
                        <input
                          type="text"
                          value={medicamento.frequencia}
                          onChange={(e) => updateMedicamento(index, 'frequencia', e.target.value)}
                          placeholder="Ex: 8/8h, 12/12h"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.medicamentos_administrados.length === 0 && (
                  <div className="empty-state">
                    Nenhum medicamento cadastrado. Clique em "Adicionar Medicamento" para incluir.
                  </div>
                )}
              </div>

              {/* Procedimentos Realizados */}
              <h3 style={pageStyles.userSectionTitle}>Procedimentos Realizados</h3>
              <hr />

              <div style={{ marginBottom: '16px' }}>
                <div className="section-actions">
                  <label className="admissao-form-label">Procedimentos Executados</label>
                  <BrButton type="button" onClick={addProcedimento} style={pageStyles.primaryButton}>Adicionar Procedimento</BrButton>
                </div>

                {formData.procedimentos_realizados.map((procedimento, index) => (
                  <div key={index} className="admissao-gestacao-card">
                    <div className="card-header">
                      <h4 className="admissao-gestacao-title">Procedimento {index + 1}</h4>
                      <button type="button" onClick={() => removeProcedimento(index)} className="admissao-remove-button">Remover</button>
                    </div>

                    <div className="card-fields">
                      <div className="card-field-wide">
                        <label>Nome do Procedimento</label>
                        <input
                          type="text"
                          value={procedimento.nome_procedimento}
                          onChange={(e) => updateProcedimento(index, 'nome_procedimento', e.target.value)}
                          placeholder="Ex: Episiotomia, Curetagem"
                        />
                      </div>
                      <div className="card-field-wide">
                        <label>Descrição</label>
                        <input
                          type="text"
                          value={procedimento.descricao}
                          onChange={(e) => updateProcedimento(index, 'descricao', e.target.value)}
                          placeholder="Descrição do procedimento"
                        />
                      </div>
                      <div className="card-field">
                        <label>Data do Procedimento</label>
                        <input
                          type="date"
                          value={procedimento.data_procedimento}
                          onChange={(e) => updateProcedimento(index, 'data_procedimento', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.procedimentos_realizados.length === 0 && (
                  <div className="empty-state">
                    Nenhum procedimento cadastrado. Clique em "Adicionar Procedimento" para incluir.
                  </div>
                )}
              </div>

              {/* Ocorrências Clínicas */}
              <h3 style={pageStyles.userSectionTitle}>Ocorrências Clínicas</h3>
              <hr />

              <div style={{ marginBottom: '16px' }}>
                <div className="section-actions">
                  <label className="admissao-form-label">Eventos e Intercorrências</label>
                  <BrButton type="button" onClick={addOcorrencia} style={pageStyles.primaryButton}>Adicionar Ocorrência</BrButton>
                </div>

                {formData.ocorrencias_clinicas.map((ocorrencia, index) => (
                  <div key={index} className="admissao-gestacao-card">
                    <div className="card-header">
                      <h4 className="admissao-gestacao-title">Ocorrência {index + 1}</h4>
                      <button type="button" onClick={() => removeOcorrencia(index)} className="admissao-remove-button">Remover</button>
                    </div>

                    <div className="card-fields">
                      <div className="card-field-full">
                        <label>Descrição da Ocorrência</label>
                        <textarea
                          value={ocorrencia.descricao}
                          onChange={(e) => updateOcorrencia(index, 'descricao', e.target.value)}
                          placeholder="Ex: Sangramento vaginal, Contrações irregulares, Alteração na pressão arterial..."
                          rows={3}
                        />
                      </div>
                      <div className="card-field">
                        <label>Data/Hora da Ocorrência</label>
                        <input
                          type="datetime-local"
                          value={ocorrencia.data_ocorrencia}
                          onChange={(e) => updateOcorrencia(index, 'data_ocorrencia', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.ocorrencias_clinicas.length === 0 && (
                  <div className="empty-state">
                    Nenhuma ocorrência clínica registrada. Clique em "Adicionar Ocorrência" para incluir eventos importantes.
                  </div>
                )}
              </div>

              {/* Botões */}
              <div style={pageStyles.buttonContainer}>
                <BrButton
                  type="button"
                  style={pageStyles.secundaryButton}
                  onClick={() => navigate('/profissionais/')}
                  disabled={loading}
                >
                  Cancelar
                </BrButton>
                <BrButton
                  type="submit"
                  style={pageStyles.primaryButton}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Atendimento'}
                </BrButton>
              </div>
            </form>
          </div>
          </>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default NovoAtendimento;