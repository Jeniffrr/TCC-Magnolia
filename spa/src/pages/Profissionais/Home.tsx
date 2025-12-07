import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Container, BrButton } from '@govbr-ds/react-components';
import AppLayout from '../../components/Layout/AppLayout';
import { pageStyles } from '../../assets/style/pageStyles';
import Loading from '../../components/Loading/Loading';
import DarAlta from './PacientesAtendimento/components/DarAlta';
import RegistrarDesfecho from './PacientesAtendimento/components/RegistrarDesfecho';
import './PacientesAtendimento/style.css';
import './style.css';

interface Leito {
  id: number;
  numero: string;
  tipo: string;
  capacidade_maxima: number;
}

interface CategoriaRisco {
  id: number;
  nome: string;
  cor: string;
  descricao: string;
}

interface Atendimento {
  categoria_risco: CategoriaRisco;
  data_hora: string;
  pressao_sistolica?: number;
  pressao_diastolica?: number;
  frequencia_cardiaca?: number;
  temperatura?: number;
  evolucao_maternidade?: string;
  avaliacao_fetal?: string;
}

interface Internacao {
  id: number;
  paciente: {
    id: number;
    nome_completo: string;
  };
  leito?: {
    nome?: string;
    numero?: string;
  };
  data_entrada: string;
  status: string;
  atendimentos?: Atendimento[];
}

interface PacienteAtendimento {
  id: number;
  internacao_id: number;
  nome_completo: string;
  leito: string;
  data_internacao: string;
  status: string;
  ultimo_atendimento?: {
    categoria_risco: CategoriaRisco;
    data_hora: string;
    pressao_sistolica?: number;
    pressao_diastolica?: number;
    frequencia_cardiaca?: number;
    temperatura?: number;
    evolucao_maternidade?: string;
    avaliacao_fetal?: string;
  };
}

const ProfissionaisHome: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'todos' | number>('todos');
  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [pacientes, setPacientes] = useState<PacienteAtendimento[]>([]);
  const [expandedPatient, setExpandedPatient] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlta, setShowAlta] = useState<{internacao_id: number, nome: string} | null>(null);
  const [showDesfecho, setShowDesfecho] = useState<{internacao_id: number, nome: string} | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leitosRes, internacoesRes] = await Promise.all([
        api.get('/api/leitos'),
        api.get('/api/internacoes?status=ativa')
      ]);
      
      const leitosData = leitosRes.data.data || leitosRes.data;
      setLeitos(Array.isArray(leitosData) ? leitosData : []);
      
      const internacoes = Array.isArray(internacoesRes.data) ? internacoesRes.data : [];
      const pacientesFormatados = internacoes.map((internacao: Internacao) => {
        const ultimoAtendimento = internacao.atendimentos && internacao.atendimentos.length > 0 
          ? internacao.atendimentos[internacao.atendimentos.length - 1] 
          : null;
          
        return {
          id: internacao.paciente.id,
          internacao_id: internacao.id,
          nome_completo: internacao.paciente.nome_completo,
          leito: internacao.leito?.numero || internacao.leito?.nome || 'Sem leito',
          data_internacao: internacao.data_entrada,
          status: internacao.status,
          ultimo_atendimento: ultimoAtendimento ? {
            categoria_risco: ultimoAtendimento.categoria_risco,
            data_hora: ultimoAtendimento.data_hora,
            pressao_sistolica: ultimoAtendimento.pressao_sistolica,
            pressao_diastolica: ultimoAtendimento.pressao_diastolica,
            frequencia_cardiaca: ultimoAtendimento.frequencia_cardiaca,
            temperatura: ultimoAtendimento.temperatura,
            evolucao_maternidade: ultimoAtendimento.evolucao_maternidade,
            avaliacao_fetal: ultimoAtendimento.avaliacao_fetal
          } : undefined
        };
      });
      
      setPacientes(pacientesFormatados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLeitos([]);
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (categoria?: CategoriaRisco) => {
    return categoria?.cor || '#6b7280';
  };

  const filteredPacientes = activeTab === 'todos' 
    ? pacientes 
    : pacientes.filter(p => p.leito === leitos.find(l => l.id === activeTab)?.numero);

  return (
    <AppLayout>
      <Container fluid>
        <div style={pageStyles.containerPadding}>
          {/* Legenda de Classificação de Risco */}
          <div className="risk-legend">
            <h3 className="risk-legend-title">
              <i className="fas fa-info-circle"></i>
              Classificação de Risco
            </h3>
            <div className="risk-legend-grid">
              <div className="risk-legend-item">
                <div className="risk-legend-dot" style={{ backgroundColor: '#28a745' }}></div>
                <div>
                  <strong className="risk-legend-label">Normal</strong>
                  <p className="risk-legend-description">Paciente sem riscos aparentes</p>
                </div>
              </div>
              <div className="risk-legend-item">
                <div className="risk-legend-dot" style={{ backgroundColor: '#ffc107' }}></div>
                <div>
                  <strong className="risk-legend-label">Médio</strong>
                  <p className="risk-legend-description">Requer atenção e monitoramento</p>
                </div>
              </div>
              <div className="risk-legend-item">
                <div className="risk-legend-dot" style={{ backgroundColor: '#dc3545' }}></div>
                <div>
                  <strong className="risk-legend-label">Alto</strong>
                  <p className="risk-legend-description">Risco elevado para mãe e/ou feto</p>
                </div>
              </div>
              <div className="risk-legend-item">
                <div className="risk-legend-dot" style={{ backgroundColor: '#6c757d' }}></div>
                <div>
                  <strong className="risk-legend-label">Aborto</strong>
                  <p className="risk-legend-description">Internação devido a processo de abortamento</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs dos Leitos */}
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'todos' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('todos')}
            >
              Todos
            </button>
            {leitos.map(leito => (
              <button
                key={leito.id}
                className={`tab-button ${activeTab === leito.id ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab(leito.id)}
              >
                {leito.numero}
              </button>
            ))}
          </div>

          <div className="table-container" style={{ borderRadius: '0 8px 8px 8px' }}>
            <table className="table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">Paciente</th>
                  <th className="table-header">Categoria de Risco</th>
                  <th className="table-header">Leito</th>
                  <th className="table-header">Data Internação</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                      <Loading message="Carregando pacientes..." />
                    </td>
                  </tr>
                ) : filteredPacientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state-row">
                      Nenhum paciente internado encontrado
                    </td>
                  </tr>
                ) : filteredPacientes.map(paciente => (
                  <React.Fragment key={paciente.id}>
                    <tr 
                      className={`table-row ${expandedPatient === paciente.id ? 'expanded-row' : ''}`}
                      onClick={() => setExpandedPatient(expandedPatient === paciente.id ? null : paciente.id)}
                    >
                      <td className="table-cell">
                        <div className="user-name">{paciente.nome_completo}</div>
                      </td>
                      <td className="table-cell">
                        <div 
                          className="risk-indicator"
                          style={{ backgroundColor: getRiskColor(paciente.ultimo_atendimento?.categoria_risco) }}
                          title={`${paciente.ultimo_atendimento?.categoria_risco?.nome || 'Sem categoria'} - ${paciente.ultimo_atendimento?.categoria_risco?.descricao || ''}`}
                        />
                      </td>
                      <td className="table-cell">{paciente.leito}</td>
                      <td className="table-cell">{new Date(paciente.data_internacao).toLocaleDateString('pt-BR')}</td>
                      <td className="table-cell">
                        <div className="action-buttons">
                          <BrButton
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profissionais/pacientes-atendimento/novo-atendimento/${paciente.id}`);
                            }}
                            className="edit-button"
                            title="Novo atendimento"
                            icon="fas fa-plus"
                          />
                          <BrButton
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profissionais/pacientes-atendimento/historico/${paciente.id}`);
                            }}
                            className="view-button"
                            title="Ver histórico"
                            icon="fas fa-clipboard-list"
                          />
                          <BrButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDesfecho({internacao_id: paciente.internacao_id, nome: paciente.nome_completo});
                            }}
                            className="edit-button"
                            title="Registrar desfecho"
                            icon="fas fa-file-medical"
                          />
                          <BrButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAlta({internacao_id: paciente.internacao_id, nome: paciente.nome_completo});
                            }}
                            className="delete-button"
                            title="Dar alta"
                            icon="fas fa-sign-out-alt"
                          />
                        </div>
                      </td>
                    </tr>

                    {expandedPatient === paciente.id && (
                      <tr className="patient-summary">
                        <td colSpan={5}>
                          <div className="patient-summary-container">
                            <h4 className="patient-summary-title">Resumo Clínico - {paciente.nome_completo}</h4>
                            <div className="patient-summary-grid">
                              <div className="patient-summary-card">
                                <strong className="patient-summary-label">Pressão Arterial:</strong>
                                <span className="patient-summary-value">{paciente.ultimo_atendimento ? `${paciente.ultimo_atendimento.pressao_sistolica || '--'}/${paciente.ultimo_atendimento.pressao_diastolica || '--'} mmHg` : '--'}</span>
                              </div>
                              <div className="patient-summary-card">
                                <strong className="patient-summary-label">Frequência Cardíaca:</strong>
                                <span className="patient-summary-value">{paciente.ultimo_atendimento?.frequencia_cardiaca || '--'} bpm</span>
                              </div>
                              <div className="patient-summary-card">
                                <strong className="patient-summary-label">Temperatura:</strong>
                                <span className="patient-summary-value">{paciente.ultimo_atendimento?.temperatura || '--'}°C</span>
                              </div>
                              <div className="patient-summary-card">
                                <strong className="patient-summary-label">Último Atendimento:</strong>
                                <span className="patient-summary-value">{paciente.ultimo_atendimento ? new Date(paciente.ultimo_atendimento.data_hora).toLocaleString('pt-BR') : 'Nenhum'}</span>
                              </div>
                              <div className="patient-summary-card full-width">
                                <strong className="patient-summary-label">Evolução:</strong>
                                <span className="patient-summary-value">{paciente.ultimo_atendimento?.evolucao_maternidade || 'Sem evolução registrada'}</span>
                              </div>
                              <div className="patient-summary-card full-width">
                                <strong className="patient-summary-label">Avaliação Fetal:</strong>
                                <span className="patient-summary-value">{paciente.ultimo_atendimento?.avaliacao_fetal || 'Sem avaliação registrada'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {showDesfecho && (
            <RegistrarDesfecho 
              internacaoId={showDesfecho.internacao_id}
              pacienteNome={showDesfecho.nome}
              onClose={() => setShowDesfecho(null)}
              onSuccess={fetchData}
            />
          )}

          {showAlta && (
            <DarAlta 
              internacaoId={showAlta.internacao_id}
              pacienteNome={showAlta.nome}
              onClose={() => setShowAlta(null)}
              onSuccess={fetchData}
            />
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default ProfissionaisHome;
