import React, { useState, useEffect } from 'react';
import { Container } from '@govbr-ds/react-components';
import AppLayout from '../../components/Layout/AppLayout';
import { pageStyles } from '../../assets/style/pageStyles';
import Loading from '../../components/Loading/Loading';
import api from '../../api/axios';

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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#711E6C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{data?.total_pacientes || 0}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Total de Pacientes</p>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#9d4edd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>
                    <i className="fas fa-bed"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{data?.total_internacoes_ativas || 0}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Internações Ativas</p>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#28a745', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>
                    <i className="fas fa-notes-medical"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{data?.total_atendimentos_mes || 0}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Atendimentos (Mês)</p>
                  </div>
                </div>
              </div>

              {/* Gráficos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {/* Pacientes por Classificação de Risco */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px', color: '#711E6C' }}></i>
                    Pacientes por Classificação de Risco
                  </h3>
                  <div>
                    {data?.pacientes_por_risco && data.pacientes_por_risco.length > 0 ? (
                      data.pacientes_por_risco.map(risco => (
                        <div key={risco.nome} style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: risco.cor }}></div>
                              <span style={{ fontSize: '14px', color: '#374151' }}>{risco.nome}</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{risco.total}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${(risco.total / maxRisco) * 100}%`, height: '100%', backgroundColor: risco.cor, transition: 'width 0.3s' }}></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px', margin: 0 }}>
                        Nenhum dado de risco disponível
                      </p>
                    )}
                  </div>
                </div>

                {/* Desfechos do Mês */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    <i className="fas fa-clipboard-check" style={{ marginRight: '8px', color: '#711E6C' }}></i>
                    Desfechos Clínicos (Mês Atual)
                  </h3>
                  <div>
                    {data?.desfechos_mes && data.desfechos_mes.length > 0 ? (
                      data.desfechos_mes.map(desfecho => (
                        <div key={desfecho.tipo} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ fontSize: '14px', color: '#374151' }}>{desfecho.tipo}</span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{desfecho.total}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px', margin: 0 }}>
                        Nenhum desfecho registrado neste mês
                      </p>
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
