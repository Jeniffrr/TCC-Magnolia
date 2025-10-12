import React from 'react';
import { Container } from '@govbr-ds/react-components';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../../assets/style/pageStyles';
import LeitoForm from './LeitoForm';
import AppLayout from '../../../../components/Layout/AppLayout';

interface LeitoCreateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const LeitoCreate: React.FC<LeitoCreateProps> = ({ onSuccess, onCancel }) => {
  const breadcrumbItems = [
    { label: '', url: '/admin' },
    { label: 'Gerenciar Leitos', url: '/admin/leitos' },
    { label: 'Cadastrar Leito', active: true }
  ];

  return (
    <AppLayout>
      <Container fluid>
        <div className="mb-3 mt-3">
          <Breadcrumb items={breadcrumbItems} homeIcon={true} />
        </div>
        
        <h1 style={pageStyles.title}>Cadastrar Leito</h1>

        <div style={pageStyles.containerPadding}>
          <LeitoForm
            leitoToEdit={null}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </div>
      </Container>
    </AppLayout>
  );
};

export default LeitoCreate;