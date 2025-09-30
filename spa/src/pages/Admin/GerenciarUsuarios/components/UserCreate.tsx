import React from 'react';
import { Container } from '@govbr-ds/react-components';
import BrHeader from '../../../../components/Header/BrHeader';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../../assets/style/pageStyles';
import UserForm from './UserForm';

interface UserCreateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const UserCreate: React.FC<UserCreateProps> = ({ onSuccess, onCancel }) => {
  const breadcrumbItems = [
    { label: '', url: '/' },
    { label: 'Gerenciar Profissionais', url: '/admin/usuarios' },
    { label: 'Cadastrar Profissional', active: true }
  ];

  return (
    <Container fluid>
      <BrHeader />
      <div className="mb-3 mt-3">
        <Breadcrumb items={breadcrumbItems} homeIcon={true} />
      </div>
      
      <h1 style={pageStyles.title}>Cadastrar Profissional</h1>
      
      <div style={pageStyles.containerPadding}>
        
        <UserForm
          userToEdit={null}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </Container>
  );
};

export default UserCreate;