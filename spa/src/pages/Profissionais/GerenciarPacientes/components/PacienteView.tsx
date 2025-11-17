import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, BrButton } from '@govbr-ds/react-components';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import AppLayout from '../../../../components/Layout/AppLayout';
import { pageStyles } from '../../../../assets/style/pageStyles';
import api from '../../../../api/axios';
import '../style.css';

interface Paciente {
  id: number;
  nome_completo: string;
  cpf: string;
  nome_mae?: string;
  data_nascimento: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  alergias?: string;
  medicamentos_continuos?: string;
  condicoes_patologicas?: Array<{ id: number; nome: string }>;
  internacoes_ativas?: Array<{
    id: number;
    motivo_internacao?: string;
    leito?: { numero: string; setor?: string };
  }>;
}

const BREADCRUMB_ITEMS = [
  { label: '', url: '/profissionais' },
  { label: 'Gerenciar Pacientes', url: '/profissionais/pacientes' },
  { label: 'Visualizar Paciente', active: true },
];



const applyCpfMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const applyPhoneMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d{4})/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

const applyCepMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const PacienteVer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadPacienteData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const token = localStorage.getItem('auth_token');
        console.log('Token presente:', !!token);
        console.log('Buscando paciente com ID:', id);
        
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }
        
        const response = await api.get('/api/pacientes');
        console.log('Resposta da API:', response.data);
        
        const pacientesList = response.data.data || [];
        const pacienteEncontrado = pacientesList.find((p: any) => p.id === parseInt(id || '0'));
        
        console.log('Paciente encontrado:', pacienteEncontrado);
        
        if (!pacienteEncontrado) {
          throw new Error('Paciente não encontrado na lista');
        }
        
        setPaciente(pacienteEncontrado);
      } catch (error: any) {
        console.error('Erro ao carregar paciente:', error);
        setApiError('Falha ao carregar dados do paciente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPacienteData();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/profissionais/pacientes');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Container fluid>
          <div className="loading-container">
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
            <p className="loading-text">Carregando paciente...</p>
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (apiError || !paciente) {
    return (
      <AppLayout>
        <Container fluid>
          <div className="alert-card error">
            <i className="fas fa-exclamation-triangle"></i>
            {apiError || 'Paciente não encontrado'}
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
          {paciente.nome_completo}
        </h1>
        
        <div style={pageStyles.containerPadding}>
          {/* Dados Pessoais */}
          <div className="paciente-info-card">
            <h3 style={pageStyles.sectionTitle}>
              <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
              Dados Pessoais
            </h3>
            <hr />
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Nome Completo:</span>
              <span className="paciente-info-value">{paciente.nome_completo}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">CPF:</span>
              <span className="paciente-info-value">{applyCpfMask(paciente.cpf)}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Nome da Mãe:</span>
              <span className="paciente-info-value">{paciente.nome_mae || '-'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Data de Nascimento:</span>
              <span className="paciente-info-value">{formatDate(paciente.data_nascimento)}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Telefone:</span>
              <span className="paciente-info-value">{applyPhoneMask(paciente.telefone)}</span>
            </div>
          </div>

          {/* Endereço */}
          <div className="paciente-info-card">
            <h3 style={pageStyles.sectionTitle}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
              Endereço
            </h3>
            <hr />
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Rua:</span>
              <span className="paciente-info-value">{paciente.rua || '-'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Número:</span>
              <span className="paciente-info-value">{paciente.numero || '-'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Bairro:</span>
              <span className="paciente-info-value">{paciente.bairro || '-'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Cidade:</span>
              <span className="paciente-info-value">{paciente.cidade || '-'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Estado:</span>
              <span className="paciente-info-value">{paciente.estado || '-'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">CEP:</span>
              <span className="paciente-info-value">{applyCepMask(paciente.cep)}</span>
            </div>
          </div>

          {/* Informações Médicas */}
          <div className="paciente-info-card">
            <h3 style={pageStyles.sectionTitle}>
              <i className="fas fa-heartbeat" style={{ marginRight: '8px' }}></i>
              Informações Médicas
            </h3>
            <hr />
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Leito:</span>
              <span className="paciente-info-value">
                {paciente.internacoes_ativas?.[0]?.leito 
                  ? `${paciente.internacoes_ativas[0].leito.numero}${paciente.internacoes_ativas[0].leito.setor ? ` - ${paciente.internacoes_ativas[0].leito.setor}` : ''}` 
                  : 'Não informado'}
              </span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Motivo da Internação:</span>
              <span className="paciente-info-value">{paciente.internacoes_ativas?.[0]?.motivo_internacao || '-'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Alergias:</span>
              <span className="paciente-info-value">{paciente.alergias || 'Nenhuma alergia informada'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Medicamentos Contínuos:</span>
              <span className="paciente-info-value">{paciente.medicamentos_continuos || 'Nenhum medicamento contínuo'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Condições Patológicas:</span>
              <span className="paciente-info-value">
                {paciente.condicoes_patologicas && paciente.condicoes_patologicas.length > 0
                  ? paciente.condicoes_patologicas.map(c => c.nome).join(', ')
                  : 'Nenhuma condição patológica informada'
                }
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={pageStyles.buttonContainer}>
            <BrButton
              type="button"
              onClick={handleBack}
              className="back-button"
            >
              Voltar
            </BrButton>
            
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default PacienteVer;