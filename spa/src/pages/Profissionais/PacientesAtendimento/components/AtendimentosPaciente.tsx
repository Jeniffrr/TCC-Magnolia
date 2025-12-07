import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { logger, performanceMonitor } from '../../../../utils/logger';
import '../style.css';

interface Paciente {
  id: number;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
}

interface Atendimento {
  id: number;
  data_atendimento: string;
  pressao_sistolica: number;
  pressao_diastolica: number;
  frequencia_cardiaca: number;
  temperatura: number;
  evolucao_maternidade: string;
  avaliacao_fetal: string;
  usuario: {
    nome: string;
  };
}

const AtendimentosPaciente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        logger.info('Carregando dados do paciente', 'AtendimentosPaciente', { pacienteId: id });
        performanceMonitor.start('carregarAtendimentos');
        
        const [pacienteRes, atendimentosRes] = await Promise.all([
          axios.get(`/api/pacientes/${id}`),
          axios.get(`/api/pacientes/${id}/atendimentos`)
        ]);
        
        performanceMonitor.end('carregarAtendimentos', 'AtendimentosPaciente');
        
        setPaciente(pacienteRes.data);
        setAtendimentos(atendimentosRes.data);
        
        logger.info('Dados carregados com sucesso', 'AtendimentosPaciente', { 
          pacienteId: id, 
          atendimentosCount: atendimentosRes.data.length 
        });
      } catch (err: unknown) {
        const error = err as { response?: { status?: number; data?: { message?: string } } };
        logger.error('Erro ao carregar dados do paciente', err, 'AtendimentosPaciente');
        
        if (error.response?.status === 404) {
          setError('Paciente não encontrado');
        } else if (error.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente');
        } else {
          setError(error.response?.data?.message || 'Erro ao carregar dados. Tente novamente');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <div className="loading">Carregando atendimentos...</div>;
  if (error) return <div className="loading" style={{ color: '#dc2626' }}>{error}</div>;
  if (!paciente) return <div className="loading">Paciente não encontrada</div>;

  return (
    <div className="historico-content">
      <div className="patient-info">
        <h3>Informações da Paciente</h3>
        <div className="info-grid">
          <div>
            <strong>Nome:</strong> {paciente.nome_completo}
          </div>
          <div>
            <strong>CPF:</strong> {paciente.cpf}
          </div>
          <div>
            <strong>Data de Nascimento:</strong> {new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>

      <div className="atendimentos-history">
        <h3>Histórico de Atendimentos</h3>
        
        {atendimentos.length === 0 ? (
          <div className="no-data">
            Nenhum atendimento registrado para esta paciente.
          </div>
        ) : (
          <div className="atendimentos-list">
            {atendimentos.map((atendimento) => (
              <div key={atendimento.id} className="atendimento-card">
                <div className="atendimento-header">
                  <div>
                    <div className="data">
                      Atendimento #{atendimento.id}
                    </div>
                    <div className="profissional">
                      {atendimento.data_atendimento ? new Date(atendimento.data_atendimento).toLocaleString('pt-BR') : 'Data não informada'} - Profissional: {atendimento.usuario?.nome || 'Não informado'}
                    </div>
                  </div>
                </div>
                
                <div className="vitals-grid">
                  <div className="vital">
                    <span>Pressão Arterial:</span> {atendimento.pressao_sistolica && atendimento.pressao_diastolica ? `${atendimento.pressao_sistolica}/${atendimento.pressao_diastolica} mmHg` : 'Não informado'}
                  </div>
                  <div className="vital">
                    <span>Frequência Cardíaca:</span> {atendimento.frequencia_cardiaca ? `${atendimento.frequencia_cardiaca} bpm` : 'Não informado'}
                  </div>
                  <div className="vital">
                    <span>Temperatura:</span> {atendimento.temperatura ? `${atendimento.temperatura}°C` : 'Não informado'}
                  </div>
                </div>
                
                <div className="evolucao">
                  <strong>Evolução Maternidade:</strong>
                  <p>{atendimento.evolucao_maternidade || 'Não informado'}</p>
                </div>
                
                <div className="avaliacao-fetal">
                  <strong>Avaliação Fetal:</strong>
                  <p>{atendimento.avaliacao_fetal || 'Não informado'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AtendimentosPaciente;