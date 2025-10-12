import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';

const Dashboard: React.FC = () => {
  return (
    <AppLayout>
      <div className="dashboard-container">
        <h1>Dashboard do Profissional</h1>
        <p>Bem-vindo ao seu painel de controle!</p>
      </div>
    </AppLayout>
  );
};

export default Dashboard;