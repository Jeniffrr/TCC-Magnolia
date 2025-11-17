import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, BrButton } from '@govbr-ds/react-components';
import AppLayout from '../../../components/Layout/AppLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../assets/style/pageStyles';
import Loading from '../../../components/Loading/Loading';
import api from '../../../api/axios';
import './style.css';

interface Atendimento {
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
  usuario?: { nome: string };
  medicamentos_administrados?: Array<{
    id: number;
    nome_medicacao: string;
    dosagem: string;
    frequencia: string;
  }>;
  exames?: Array<{
    id: number;
    tipo: string;
    resultado: string;
    data: string;
  }>;
  exames_laboratoriais?: Array<{
    id: number;
    nome: string;
    resultado: string;
    data_exame: string;
  }>;
  procedimentos_realizados?: Array<{
    id: number;
    nome_procedimento: string;
    observacoes?: string;
    descricao?: string;
    data_procedimento?: string;
  }>;
}

interface Desfecho {
  id: number;
  tipo: string;
  data_hora_evento: string;
  semana_gestacional: number;
  tipo_parto?: string;
  observacoes?: string;
  recem_nascidos?: Array<{
    id: number;
    sexo: string;
    peso: number;
    altura: number;
    apgar_1_min: number;
    apgar_5_min: number;
    observacoes_iniciais?: string;
  }>;
}

interface PacienteCompleto {
  id: number;
  nome_completo: string;
  cpf: string;
  nome_mae?: string;
  data_nascimento: string;
  telefone: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  alergias: string;
  medicamentos_continuos: string;
  condicoes_patologicas?: Array<{
    id: number;
    nome: string;
  }>;
  gestacoes_anteriores?: Array<{
    id: number;
    ano_parto: string;
    tipo_parto: string;
    observacoes?: string;
  }>;
}

const HistoricoCompleto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<PacienteCompleto | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [desfechos, setDesfechos] = useState<Desfecho[]>([]);
  const [loading, setLoading] = useState(true);

  const BREADCRUMB_ITEMS = [
    { label: "", url: "/profissionais" },
    { label: "Histórico Completo", active: true },
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const pacienteRes = await api.get(`/api/pacientes/${id}?with=condicoes_patologicas,gestacoes_anteriores`);
      const internacoesRes = await api.get(`/api/internacoes?paciente_id=${id}`);
      
      const pacienteData = pacienteRes.data.data || pacienteRes.data;
      const internacoesData = internacoesRes.data.data || internacoesRes.data;
      
      setPaciente(pacienteData);
      
      const todosAtendimentos = [];
      const todosDesfechos = [];
      for (const internacao of internacoesData) {
        try {
          const atendimentosRes = await api.get(`/api/internacoes/${internacao.id}/atendimentos`);
          const atendimentos = atendimentosRes.data || [];
          todosAtendimentos.push(...atendimentos);
          
          if (internacao.desfecho) {
            todosDesfechos.push(internacao.desfecho);
          }
        } catch (error) {
          console.error(`Erro ao buscar atendimentos da internação ${internacao.id}:`, error);
        }
      }
      
      setAtendimentos(todosAtendimentos);
      setDesfechos(todosDesfechos);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

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

        <h1 style={pageStyles.title}>Histórico Completo do Paciente</h1>

        <div style={pageStyles.containerPadding}>
          {loading ? (
            <Loading message="Carregando histórico..." />
          ) : (
          <>
            <div className="paciente-info-card">
            <h3 style={pageStyles.sectionTitle}>
              <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
              Dados Pessoais
            </h3>
            <hr />
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Nome Completo:</span>
              <span className="paciente-info-value">{paciente?.nome_completo}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">CPF:</span>
              <span className="paciente-info-value">{paciente?.cpf}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Data Nascimento:</span>
              <span className="paciente-info-value">{paciente?.data_nascimento && new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Telefone:</span>
              <span className="paciente-info-value">{paciente?.telefone || '-'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Nome da Mãe:</span>
              <span className="paciente-info-value">{paciente?.nome_mae || '-'}</span>
            </div>

          {(paciente?.rua || paciente?.cidade) && (
            <>
              <h3 style={pageStyles.sectionTitle}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
                Endereço
              </h3>
              <hr />
              
              <div className="paciente-info-row">
                <span className="paciente-info-label">Rua:</span>
                <span className="paciente-info-value">{paciente?.rua || '-'}</span>
              </div>
              
              <div className="paciente-info-row">
                <span className="paciente-info-label">Número:</span>
                <span className="paciente-info-value">{paciente?.numero || '-'}</span>
              </div>
              
              <div className="paciente-info-row">
                <span className="paciente-info-label">Bairro:</span>
                <span className="paciente-info-value">{paciente?.bairro || '-'}</span>
              </div>
              
              <div className="paciente-info-row">
                <span className="paciente-info-label">Cidade:</span>
                <span className="paciente-info-value">{paciente?.cidade || '-'}</span>
              </div>
              
              <div className="paciente-info-row">
                <span className="paciente-info-label">Estado:</span>
                <span className="paciente-info-value">{paciente?.estado || '-'}</span>
              </div>
              
              <div className="paciente-info-row">
                <span className="paciente-info-label">CEP:</span>
                <span className="paciente-info-value">{paciente?.cep || '-'}</span>
              </div>
            </>
          )}


            <h3 style={pageStyles.sectionTitle}>
              <i className="fas fa-heartbeat" style={{ marginRight: '8px' }}></i>
              Informações Clínicas
            </h3>
            <hr />
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Alergias:</span>
              <span className="paciente-info-value">{paciente?.alergias || 'Nenhuma alergia informada'}</span>
            </div>
            
            <div className="paciente-info-row">
              <span className="paciente-info-label">Medicamentos Contínuos:</span>
              <span className="paciente-info-value">{paciente?.medicamentos_continuos || 'Nenhum medicamento contínuo'}</span>
            </div>
            
            {paciente?.condicoes_patologicas && paciente.condicoes_patologicas.length > 0 && (
              <div className="paciente-info-row">
                <span className="paciente-info-label">Condições Patológicas:</span>
                <span className="paciente-info-value">
                  {paciente.condicoes_patologicas.map(c => c.nome).join(', ')}
                </span>
              </div>
            )}
            
            {paciente?.gestacoes_anteriores && paciente.gestacoes_anteriores.length > 0 && (
              <div className="paciente-info-row">
                <span className="paciente-info-label">Gestações Anteriores:</span>
                <span className="paciente-info-value">
                  {paciente.gestacoes_anteriores.map(g => 
                    `${g.ano_parto} (${g.tipo_parto})${g.observacoes ? ` - ${g.observacoes}` : ''}`
                  ).join('; ')}
                </span>
              </div>
            )}

          {desfechos.length > 0 && (
            <>
              <h3 style={pageStyles.sectionTitle}>
                <i className="fas fa-clipboard-check" style={{ marginRight: '8px' }}></i>
                Desfechos Clínicos
              </h3>
              <hr />
            {desfechos.map(desfecho => (
              <div key={desfecho.id} className="desfecho-item">
                <div className="desfecho-grid">
                  <div><strong>Tipo:</strong> {desfecho.tipo}</div>
                  <div><strong>Data/Hora:</strong> {new Date(desfecho.data_hora_evento).toLocaleString('pt-BR')}</div>
                  <div><strong>Semana Gestacional:</strong> {desfecho.semana_gestacional} semanas</div>
                  {desfecho.tipo_parto && <div><strong>Tipo de Parto:</strong> {desfecho.tipo_parto}</div>}
                </div>
                {desfecho.observacoes && (
                  <div className="desfecho-obs">
                    <strong>Observações:</strong> {desfecho.observacoes}
                  </div>
                )}
                {desfecho.recem_nascidos && desfecho.recem_nascidos.length > 0 && (
                  <div className="recem-nascidos-section">
                    <strong>Recém-Nascido(s):</strong>
                    {desfecho.recem_nascidos.map((rn) => (
                      <div key={rn.id} className="recem-nascido-item">
                        <div className="recem-nascido-grid">
                          <div><strong>Sexo:</strong> {rn.sexo}</div>
                          <div><strong>Peso:</strong> {rn.peso} kg</div>
                          <div><strong>Altura:</strong> {rn.altura} cm</div>
                          <div><strong>APGAR 1':</strong> {rn.apgar_1_min}</div>
                          <div><strong>APGAR 5':</strong> {rn.apgar_5_min}</div>
                        </div>
                        {rn.observacoes_iniciais && (
                          <div className="rn-obs"><strong>Observações:</strong> {rn.observacoes_iniciais}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              ))}
            </>
          )}


            <h3 style={pageStyles.sectionTitle}>
              <i className="fas fa-notes-medical" style={{ marginRight: '8px' }}></i>
              Histórico de Atendimentos ({atendimentos.length})
            </h3>
            <hr />
          {atendimentos.length === 0 ? (
            <p className="p-6 text-center text-gray-500">Nenhum atendimento registrado</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {atendimentos.map(atendimento => (
                <div key={atendimento.id} className="atendimento-card">
                  <div className="atendimento-header">
                    <span className="data">{new Date(atendimento.data_hora).toLocaleString('pt-BR')}</span>
                    <span className="profissional">Dr(a). {atendimento.usuario?.nome || 'Usuário não identificado'}</span>
                  </div>
                  
                  <div className="vitals-grid">
                    {atendimento.pressao_sistolica && (
                      <div className="vital">
                        <span>PA:</span> {atendimento.pressao_sistolica}/{atendimento.pressao_diastolica} mmHg
                      </div>
                    )}
                    {atendimento.frequencia_cardiaca && (
                      <div className="vital">
                        <span>FC:</span> {atendimento.frequencia_cardiaca} bpm
                      </div>
                    )}
                    {atendimento.temperatura && (
                      <div className="vital">
                        <span>Temp:</span> {atendimento.temperatura}°C
                      </div>
                    )}
                    {atendimento.frequencia_respiratoria && (
                      <div className="vital">
                        <span>FR:</span> {atendimento.frequencia_respiratoria} rpm
                      </div>
                    )}
                    {atendimento.bcf && (
                      <div className="vital">
                        <span>BCF:</span> {atendimento.bcf} bpm
                      </div>
                    )}
                    {atendimento.altura_uterina && (
                      <div className="vital">
                        <span>AU:</span> {atendimento.altura_uterina} cm
                      </div>
                    )}
                    {atendimento.movimentos_fetais_presentes !== undefined && (
                      <div className="vital">
                        <span>MF:</span> {atendimento.movimentos_fetais_presentes ? 'Presentes' : 'Ausentes'}
                      </div>
                    )}
                  </div>

                  <div className="evolucao">
                    <strong>Evolução:</strong>
                    <p>{atendimento.evolucao_maternidade}</p>
                  </div>

                  {atendimento.avaliacao_fetal && (
                    <div className="avaliacao-fetal">
                      <strong>Avaliação Fetal:</strong>
                      <p>{atendimento.avaliacao_fetal}</p>
                    </div>
                  )}

                  {atendimento.medicamentos_administrados && atendimento.medicamentos_administrados.length > 0 && (
                    <div className="medicamentos">
                      <strong>Medicamentos Administrados:</strong>
                      <ul>
                        {atendimento.medicamentos_administrados.map(med => (
                          <li key={med.id}>
                            {med.nome_medicacao} - {med.dosagem} ({med.frequencia})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {((atendimento.exames && atendimento.exames.length > 0) || (atendimento.exames_laboratoriais && atendimento.exames_laboratoriais.length > 0)) && (
                    <div className="exames">
                      <strong>Exames Realizados:</strong>
                      {atendimento.exames && atendimento.exames.map(exame => (
                        <div key={exame.id} className="exame-item">
                          <strong>{exame.tipo}:</strong> {exame.resultado}
                          <small> ({new Date(exame.data).toLocaleDateString('pt-BR')})</small>
                        </div>
                      ))}
                      {atendimento.exames_laboratoriais && atendimento.exames_laboratoriais.map(exame => (
                        <div key={exame.id} className="exame-item">
                          <strong>{exame.nome}:</strong> {exame.resultado}
                          <small> ({new Date(exame.data_exame).toLocaleDateString('pt-BR')})</small>
                        </div>
                      ))}
                      {atendimento.procedimentos_realizados && atendimento.procedimentos_realizados.map(proc => (
                        <div key={proc.id} className="procedimento-item">
                          <strong>{proc.nome_procedimento}:</strong> {proc.observacoes || proc.descricao}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
            </div>

            <div style={pageStyles.buttonContainer}>
              <BrButton
                type="button"
                onClick={() => navigate('/profissionais/')}
                className="back-button"
              >
                Voltar
              </BrButton>
            </div>
          </>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default HistoricoCompleto;
