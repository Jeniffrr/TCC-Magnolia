import React from 'react';
import { BrButton } from '@govbr-ds/react-components';
import AppLayout from '../../../../components/Layout/AppLayout';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../../assets/style/pageStyles';
import type { Leito } from '../../../../services/leitoService';

interface LeitoViewProps {
  leito: Leito;
  onBack: () => void;
}

const LeitoView: React.FC<LeitoViewProps> = ({ leito, onBack }) => {
  const breadcrumbItems = [
    { label: '', url: '/admin' },
    { label: 'Gerenciar Leitos', url: '/admin/leitos' },
    { label: 'Visualizar Leito', active: true }
  ];
  
  return (
    <AppLayout>
      <div className="mb-3 mt-3">
        <Breadcrumb items={breadcrumbItems} homeIcon={true} />
      </div>
      
      <h1 style={pageStyles.title}>Visualizar Leito</h1>
      
      <div style={pageStyles.containerPadding}>
        <div className="view-container">
          <div className="view-section">
            <h3>Dados do Leito</h3>
            <div className="view-field">
              <label>Número do Leito:</label>
              <span>{leito.numero}</span>
            </div>
            <div className="view-field">
              <label>Tipo:</label>
              <span>{leito.tipo}</span>
            </div>
            <div className="view-field">
              <label>Capacidade Máxima:</label>
              <span>{leito.capacidade_maxima}</span>
            </div>
            <div className="view-field">
              <label>Data de Cadastro:</label>
              <span>{new Date(leito.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          <div className="view-actions">
            <BrButton onClick={onBack} className="back-button">
              Voltar
            </BrButton>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LeitoView;