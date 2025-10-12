import React from 'react';
import { Container } from '@govbr-ds/react-components';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../../assets/style/pageStyles';
import LeitoForm from './LeitoForm';
import type { Leito } from '../../../../services/leitoService';
import AppLayout from '../../../../components/Layout/AppLayout';

interface LeitoEditProps {
  leito: Leito;
  onSuccess: () => void;
  onCancel: () => void;
}

const LeitoEdit: React.FC<LeitoEditProps> = ({ leito, onSuccess, onCancel }) => {
  const breadcrumbItems = [
    { label: '', url: '/admin' },
    { label: 'Gerenciar Leitos', url: '/admin/leitos' },
    { label: 'Editar Leito', active: true }
  ];

  return (
    <AppLayout>
      <Container fluid>
        <div className="mb-3 mt-3">
          <Breadcrumb items={breadcrumbItems} homeIcon={true} />
        </div>
        
        <h1 style={pageStyles.title}>Editar Leito</h1>
        
        <div style={pageStyles.containerPadding}>
          <LeitoForm
            leitoToEdit={leito}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </div>
      </Container>
    </AppLayout>
  );
};

export default LeitoEdit;