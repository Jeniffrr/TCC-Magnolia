import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, BrButton } from '@govbr-ds/react-components';
import AppLayout from '../../../../components/Layout/AppLayout';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import BrInputIcon from '../../../../components/BrInputIcon/BrInputIcon';
import { pageStyles, getFieldStatus, getFeedbackText } from '../../../../assets/style/pageStyles';
import api from '../../../../api/axios';
import { atendimentosService } from '../../../../services/atendimentoService';
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
      const pacienteRes = await api.get(`/api/pacientes/${pacienteId}`);
      setPaciente(pacienteRes.data);
    } catch {
      // Erro ao carregar dados
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
      procedimentos_realizados: [...prev.procedimentos_realizados, { nome_procedimento: '', descricao: '' }]
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
      await atendimentosService.createForInternacao(internacao.id, atendimentoData);
      
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

  if (!paciente) {
    return (
      <AppLayout>
        <Container fluid>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="loading">Carregando dados da paciente...</div>
          </div>
        </Container>
      </AppLayout>
    );
  }

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
          Novo Atendimento - {paciente.nome_completo}
        </h1>
        
        <div style={pageStyles.containerPadding}>
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

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '150px', position: 'relative' }}>
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
                  <span style={{ position: 'absolute', right: '12px', top: '38px', fontSize: '14px', color: '#666', pointerEvents: 'none', backgroundColor: 'white', padding: '0 4px' }}>mmHg</span>
                </div>
                <div style={{ flex: '1', minWidth: '150px', position: 'relative' }}>
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
                  <span style={{ position: 'absolute', right: '12px', top: '38px', fontSize: '14px', color: '#666', pointerEvents: 'none', backgroundColor: 'white', padding: '0 4px' }}>mmHg</span>
                </div>
                <div style={{ flex: '1', minWidth: '150px', position: 'relative' }}>
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
                  <span style={{ position: 'absolute', right: '12px', top: '38px', fontSize: '14px', color: '#666', pointerEvents: 'none', backgroundColor: 'white', padding: '0 4px' }}>bpm</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
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
                  <span style={{ position: 'absolute', right: '12px', top: '38px', fontSize: '14px', color: '#666', pointerEvents: 'none', backgroundColor: 'white', padding: '0 4px' }}>°C</span>
                </div>
                <div style={{ flex: '1', minWidth: '150px', position: 'relative' }}>
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
                  <span style={{ position: 'absolute', right: '12px', top: '38px', fontSize: '14px', color: '#666', pointerEvents: 'none', backgroundColor: 'white', padding: '0 4px' }}>rpm</span>
                </div>
              </div>

              {/* Avaliação Obstétrica */}
              <h3 style={pageStyles.userSectionTitle}>Avaliação Obstétrica</h3>
              <hr />
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div style={{ flex: '1', minWidth: '150px', position: 'relative' }}>
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
                  <span style={{ position: 'absolute', right: '12px', top: '38px', fontSize: '14px', color: '#666', pointerEvents: 'none', backgroundColor: 'white', padding: '0 4px' }}>bpm</span>
                </div>
                <div style={{ flex: '1', minWidth: '150px', position: 'relative' }}>
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
                  <span style={{ position: 'absolute', right: '12px', top: '38px', fontSize: '14px', color: '#666', pointerEvents: 'none', backgroundColor: 'white', padding: '0 4px' }}>cm</span>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '200px', paddingBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="movimentos_fetais_presentes"
                    checked={formData.movimentos_fetais_presentes}
                    onChange={(e) => setFormData(prev => ({ ...prev, movimentos_fetais_presentes: e.target.checked }))}
                    style={{ width: '18px', height: '18px', accentColor: '#711E6C' }}
                  />
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>Movimentos Fetais Presentes</span>
                </label>
              </div>

              {/* Evolução Clínica */}
              <h3 style={pageStyles.userSectionTitle}>Evolução Clínica</h3>
              <hr />

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Evolução Maternidade</label>
                  <textarea
                    name="evolucao_maternidade"
                    value={formData.evolucao_maternidade}
                    onChange={handleInputChange}
                    rows={4}
                    style={{ width: '98%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', resize: 'vertical' }}
                    placeholder="Descreva a evolução clínica da paciente..."
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Avaliação Fetal</label>
                  <textarea
                    name="avaliacao_fetal"
                    value={formData.avaliacao_fetal}
                    onChange={handleInputChange}
                    rows={3}
                    style={{ width: '98%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', resize: 'vertical' }}
                    placeholder="Descreva a avaliação fetal..."
                  />
                </div>
              </div>

              {/* Exames Laboratoriais */}
              <h3 style={pageStyles.userSectionTitle}>Exames Laboratoriais</h3>
              <hr />

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admissao-form-label">Exames Realizados</label>
                  <BrButton type="button" onClick={addExame} style={pageStyles.primaryButton}>Adicionar Exame</BrButton>
                </div>

                {formData.exames_laboratoriais.map((exame, index) => (
                  <div key={index} className="admissao-gestacao-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 className="admissao-gestacao-title">Exame {index + 1}</h4>
                      <button type="button" onClick={() => removeExame(index)} className="admissao-remove-button">Remover</button>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Nome do Exame</label>
                        <input
                          type="text"
                          value={exame.nome}
                          onChange={(e) => updateExame(index, 'nome', e.target.value)}
                          placeholder="Ex: Hemograma, Glicemia"
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Resultado</label>
                        <input
                          type="text"
                          value={exame.resultado}
                          onChange={(e) => updateExame(index, 'resultado', e.target.value)}
                          placeholder="Ex: Normal, Alterado"
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ flex: '1', minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Data do Exame</label>
                        <input
                          type="date"
                          value={exame.data_exame}
                          onChange={(e) => updateExame(index, 'data_exame', e.target.value)}
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.exames_laboratoriais.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontStyle: 'italic', border: '2px dashed #ddd', borderRadius: '8px' }}>
                    Nenhum exame laboratorial cadastrado. Clique em "Adicionar Exame" para incluir.
                  </div>
                )}
              </div>

              {/* Medicamentos Administrados */}
              <h3 style={pageStyles.userSectionTitle}>Medicamentos Administrados</h3>
              <hr />

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admissao-form-label">Medicações Aplicadas</label>
                  <BrButton type="button" onClick={addMedicamento} style={pageStyles.primaryButton}>Adicionar Medicamento</BrButton>
                </div>

                {formData.medicamentos_administrados.map((medicamento, index) => (
                  <div key={index} className="admissao-gestacao-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 className="admissao-gestacao-title">Medicamento {index + 1}</h4>
                      <button type="button" onClick={() => removeMedicamento(index)} className="admissao-remove-button">Remover</button>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Nome da Medicação</label>
                        <input
                          type="text"
                          value={medicamento.nome_medicacao}
                          onChange={(e) => updateMedicamento(index, 'nome_medicacao', e.target.value)}
                          placeholder="Ex: Dipirona, Paracetamol"
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ flex: '1', minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Dosagem</label>
                        <input
                          type="text"
                          value={medicamento.dosagem}
                          onChange={(e) => updateMedicamento(index, 'dosagem', e.target.value)}
                          placeholder="Ex: 500mg, 1ml"
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ flex: '1', minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Frequência</label>
                        <input
                          type="text"
                          value={medicamento.frequencia}
                          onChange={(e) => updateMedicamento(index, 'frequencia', e.target.value)}
                          placeholder="Ex: 8/8h, 12/12h"
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.medicamentos_administrados.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontStyle: 'italic', border: '2px dashed #ddd', borderRadius: '8px' }}>
                    Nenhum medicamento cadastrado. Clique em "Adicionar Medicamento" para incluir.
                  </div>
                )}
              </div>

              {/* Procedimentos Realizados */}
              <h3 style={pageStyles.userSectionTitle}>Procedimentos Realizados</h3>
              <hr />

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admissao-form-label">Procedimentos Executados</label>
                  <BrButton type="button" onClick={addProcedimento} style={pageStyles.primaryButton}>Adicionar Procedimento</BrButton>
                </div>

                {formData.procedimentos_realizados.map((procedimento, index) => (
                  <div key={index} className="admissao-gestacao-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 className="admissao-gestacao-title">Procedimento {index + 1}</h4>
                      <button type="button" onClick={() => removeProcedimento(index)} className="admissao-remove-button">Remover</button>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Nome do Procedimento</label>
                        <input
                          type="text"
                          value={procedimento.nome_procedimento}
                          onChange={(e) => updateProcedimento(index, 'nome_procedimento', e.target.value)}
                          placeholder="Ex: Episiotomia, Curetagem"
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Descrição</label>
                        <input
                          type="text"
                          value={procedimento.descricao}
                          onChange={(e) => updateProcedimento(index, 'descricao', e.target.value)}
                          placeholder="Descrição do procedimento"
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.procedimentos_realizados.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontStyle: 'italic', border: '2px dashed #ddd', borderRadius: '8px' }}>
                    Nenhum procedimento cadastrado. Clique em "Adicionar Procedimento" para incluir.
                  </div>
                )}
              </div>

              {/* Ocorrências Clínicas */}
              <h3 style={pageStyles.userSectionTitle}>Ocorrências Clínicas</h3>
              <hr />

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label className="admissao-form-label">Eventos e Intercorrências</label>
                  <BrButton type="button" onClick={addOcorrencia} style={pageStyles.primaryButton}>Adicionar Ocorrência</BrButton>
                </div>

                {formData.ocorrencias_clinicas.map((ocorrencia, index) => (
                  <div key={index} className="admissao-gestacao-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 className="admissao-gestacao-title">Ocorrência {index + 1}</h4>
                      <button type="button" onClick={() => removeOcorrencia(index)} className="admissao-remove-button">Remover</button>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '2', minWidth: '300px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Descrição da Ocorrência</label>
                        <textarea
                          value={ocorrencia.descricao}
                          onChange={(e) => updateOcorrencia(index, 'descricao', e.target.value)}
                          placeholder="Ex: Sangramento vaginal, Contrações irregulares, Alteração na pressão arterial..."
                          rows={3}
                          style={{ width: '95%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', resize: 'vertical' }}
                        />
                      </div>
                      <div style={{ flex: '1', minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Data/Hora da Ocorrência</label>
                        <input
                          type="datetime-local"
                          value={ocorrencia.data_ocorrencia}
                          onChange={(e) => updateOcorrencia(index, 'data_ocorrencia', e.target.value)}
                          style={{ width: '95%', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.ocorrencias_clinicas.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontStyle: 'italic', border: '2px dashed #ddd', borderRadius: '8px' }}>
                    Nenhuma ocorrência clínica registrada. Clique em "Adicionar Ocorrência" para incluir eventos importantes.
                  </div>
                )}
              </div>

              {/* Botões */}
              <div style={pageStyles.buttonContainer}>
                <BrButton
                  type="button"
                  className="clear-button"
                  onClick={() => navigate('/profissionais/')}
                  disabled={loading}
                >
                  Cancelar
                </BrButton>
                <BrButton
                  type="submit"
                  className="register-button"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Atendimento'}
                </BrButton>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default NovoAtendimento;