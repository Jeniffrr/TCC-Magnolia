import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { Container, BrButton } from '@govbr-ds/react-components';
import AppLayout from '../../../components/Layout/AppLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../assets/style/pageStyles';
import DarAlta from './components/DarAlta';
import RegistrarDesfecho from './components/RegistrarDesfecho';
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

const BREADCRUMB_ITEMS = [
  { label: "", url: "/profissionais" },
  { label: "Atendimento de Pacientes", active: true },
];

const PacientesAtendimento: React.FC = () => {
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
      
      // Leitos vêm paginados da API
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
    } catch (error: unknown) {
      console.error('Erro ao carregar dados:', error);
      
      // Type guard para verificar se é um erro do axios
      const isAxiosError = error && typeof error === 'object' && 'response' in error;
      
      if (isAxiosError) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        console.error('Status do erro:', axiosError.response?.status);
        console.error('Detalhes do erro:', axiosError.response?.data);
        
        // Se for erro de autenticação, redirecionar para login
        if (axiosError.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          return;
        }
      }
      
      // Definir dados vazios em caso de erro
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

  if (loading) return (
    <AppLayout>
      <Container fluid>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="loading">Carregando dados...</div>
        </div>
      </Container>
    </AppLayout>
  );

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
          Atendimento de Pacientes
        </h1>
        
        <div style={pageStyles.containerPadding}>
          {/* Tabs dos Leitos */}
          <div style={{ marginBottom: '0' }}>
            <button 
              style={{
                padding: '12px 20px',
                background: activeTab === 'todos' ? '#F6DFF8' : '#f8f9fa',
                color: activeTab === 'todos' ? '#000000' : '#6c757d',
                border: '1px solid #dee2e6',
                borderBottom: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                marginRight: '2px',
                fontWeight: 'normal',
                fontSize: '14px'
              }}
              onClick={() => setActiveTab('todos')}
            >
              Todos
            </button>
            {leitos.map(leito => (
              <button
                key={leito.id}
                style={{
                  padding: '12px 20px',
                  background: activeTab === leito.id ? '#F6DFF8' : '#f8f9fa',
                  color: activeTab === leito.id ? '#000000' : '#6c757d',
                  border: '1px solid #dee2e6',
                  borderBottom: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  marginRight: '2px',
                  fontWeight: 'normal',
                  fontSize: '14px'
                }}
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
                {filteredPacientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6c757d', fontStyle: 'italic' }}>
                      Nenhum paciente internado encontrado
                    </td>
                  </tr>
                ) : filteredPacientes.map(paciente => (
                  <React.Fragment key={paciente.id}>
                    <tr 
                      className="table-row"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: expandedPatient === paciente.id ? '#fef6ff' : 'transparent'
                      }}
                      onClick={() => setExpandedPatient(expandedPatient === paciente.id ? null : paciente.id)}
                    >
                      <td className="table-cell">
                        <div className="user-name">{paciente.nome_completo}</div>
                      </td>
                      <td className="table-cell">
                        <div 
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: getRiskColor(paciente.ultimo_atendimento?.categoria_risco),
                            border: '2px solid rgba(0,0,0,0.1)',
                            display: 'inline-block'
                          }}
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
                            className="warning-button"
                            title="Registrar desfecho"
                            icon="fas fa-baby"
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

                    {/* Resumo expandido */}
                    {expandedPatient === paciente.id && (
                      <tr style={{ backgroundColor: '#fef6ff' }}>
                        <td colSpan={5} style={{ padding: '20px', borderBottom: '1px solid #dee2e6' }}>
                          <div style={{ borderLeft: '4px solid #711E6C', paddingLeft: '16px' }}>
                            <h4 style={{ margin: '0 0 16px 0', color: '#711E6C', fontSize: '16px' }}>Resumo Clínico - {paciente.nome_completo}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                              <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                                <strong style={{ color: '#495057', display: 'block', marginBottom: '4px' }}>Pressão Arterial:</strong>
                                <span style={{ color: '#6c757d' }}>{paciente.ultimo_atendimento ? `${paciente.ultimo_atendimento.pressao_sistolica || '--'}/${paciente.ultimo_atendimento.pressao_diastolica || '--'} mmHg` : '--'}</span>
                              </div>
                              <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                                <strong style={{ color: '#495057', display: 'block', marginBottom: '4px' }}>Frequência Cardíaca:</strong>
                                <span style={{ color: '#6c757d' }}>{paciente.ultimo_atendimento?.frequencia_cardiaca || '--'} bpm</span>
                              </div>
                              <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                                <strong style={{ color: '#495057', display: 'block', marginBottom: '4px' }}>Temperatura:</strong>
                                <span style={{ color: '#6c757d' }}>{paciente.ultimo_atendimento?.temperatura || '--'}°C</span>
                              </div>
                              <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                                <strong style={{ color: '#495057', display: 'block', marginBottom: '4px' }}>Último Atendimento:</strong>
                                <span style={{ color: '#6c757d' }}>{paciente.ultimo_atendimento ? new Date(paciente.ultimo_atendimento.data_hora).toLocaleString('pt-BR') : 'Nenhum'}</span>
                              </div>
                              <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e9ecef', gridColumn: 'span 2' }}>
                                <strong style={{ color: '#495057', display: 'block', marginBottom: '4px' }}>Evolução:</strong>
                                <span style={{ color: '#6c757d', lineHeight: '1.4' }}>{paciente.ultimo_atendimento?.evolucao_maternidade || 'Sem evolução registrada'}</span>
                              </div>
                              <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e9ecef', gridColumn: 'span 2' }}>
                                <strong style={{ color: '#495057', display: 'block', marginBottom: '4px' }}>Avaliação Fetal:</strong>
                                <span style={{ color: '#6c757d', lineHeight: '1.4' }}>{paciente.ultimo_atendimento?.avaliacao_fetal || 'Sem avaliação registrada'}</span>
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

          {/* Modais */}
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

export default PacientesAtendimento;