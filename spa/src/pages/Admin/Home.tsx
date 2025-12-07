import { useState, useEffect } from 'react';
import { Container } from '@govbr-ds/react-components';
import AppLayout from '../../components/Layout/AppLayout';
import { pageStyles } from '../../assets/style/pageStyles';
import Loading from '../../components/Loading/Loading';
import api from '../../api/axios';
import './style.css';

interface DashboardData {
  pacientes_por_risco: { nome: string; cor: string; total: number }[];
  total_pacientes: number;
  total_internacoes_ativas: number;
  total_atendimentos_mes: number;
  desfechos_mes: { tipo: string; total: number }[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/dashboard/estatisticas');
      console.log('Dashboard data:', response.data);
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxRisco = Math.max(...(data?.pacientes_por_risco.map(r => r.total) || [1]));

  return (
    <AppLayout>
      <Container fluid>
        <h1 style={{ ...pageStyles.title, marginBottom: '40px' }}>Painel Administrativo</h1>
        
        <div style={pageStyles.containerPadding}>
          {loading ? (
            <Loading message="Carregando dashboard..." />
          ) : (
            <>
              {/* Cards de Resumo */}
              <div className="dashboard-cards">
                <div className="dashboard-card">
                  <div className="dashboard-card-icon primary">
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <h3 className="dashboard-card-value">{data?.total_pacientes || 0}</h3>
                    <p className="dashboard-card-label">Total de Pacientes</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon secondary">
                    <i className="fas fa-bed"></i>
                  </div>
                  <div>
                    <h3 className="dashboard-card-value">{data?.total_internacoes_ativas || 0}</h3>
                    <p className="dashboard-card-label">Internações Ativas</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon success">
                    <i className="fas fa-notes-medical"></i>
                  </div>
                  <div>
                    <h3 className="dashboard-card-value">{data?.total_atendimentos_mes || 0}</h3>
                    <p className="dashboard-card-label">Atendimentos (Mês)</p>
                  </div>
                </div>
              </div>

              {/* Gráficos */}
              <div className="dashboard-charts">
                {/* Pacientes por Classificação de Risco */}
                <div className="dashboard-chart">
                  <h3 className="dashboard-chart-title">
                    <i className="fas fa-exclamation-triangle"></i>
                    Pacientes por Classificação de Risco
                  </h3>
                  <div>
                    {data?.pacientes_por_risco && data.pacientes_por_risco.length > 0 ? (
                      data.pacientes_por_risco.map(risco => (
                        <div key={risco.nome} className="risk-item">
                          <div className="risk-item-header">
                            <div className="risk-item-label">
                              <div className="risk-item-dot" style={{ backgroundColor: risco.cor }}></div>
                              <span className="risk-item-name">{risco.nome}</span>
                            </div>
                            <span className="risk-item-value">{risco.total}</span>
                          </div>
                          <div className="risk-item-bar-container">
                            <div className="risk-item-bar" style={{ width: `${(risco.total / maxRisco) * 100}%`, backgroundColor: risco.cor }}></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty-state">Nenhum dado de risco disponível</p>
                    )}
                  </div>
                </div>

                {/* Desfechos do Mês */}
                <div className="dashboard-chart">
                  <h3 className="dashboard-chart-title">
                    <i className="fas fa-clipboard-check"></i>
                    Desfechos Clínicos (Mês Atual)
                  </h3>
                  <div>
                    {data?.desfechos_mes && data.desfechos_mes.length > 0 ? (
                      data.desfechos_mes.map(desfecho => (
                        <div key={desfecho.tipo} className="desfecho-item">
                          <span className="desfecho-item-label">{desfecho.tipo}</span>
                          <span className="desfecho-item-value">{desfecho.total}</span>
                        </div>
                      ))
                    ) : (
                      <p className="empty-state">Nenhum desfecho registrado neste mês</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </AppLayout>
  );
}
