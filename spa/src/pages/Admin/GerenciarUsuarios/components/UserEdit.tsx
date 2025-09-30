import React from 'react';
import { Container } from '@govbr-ds/react-components';
import BrHeader from '../../../../components/Header/BrHeader';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../../assets/style/pageStyles';
import UserForm from './UserForm';
import type { Usuario } from '../../../../services/adminService';

interface UserEditProps {
  user: Usuario;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserEdit: React.FC<UserEditProps> = ({ user, onSuccess, onCancel }) => {
  const breadcrumbItems = [
    { label: '', url: '/' },
    { label: 'Gerenciar Profissionais', url: '/admin/usuarios' },
    { label: 'Editar Profissional', active: true }
  ];

  return (
    <Container fluid>
      <BrHeader />
      <div className="mb-3 mt-3">
        <Breadcrumb items={breadcrumbItems} homeIcon={true} />
      </div>
      
      <h1 style={pageStyles.title}>Editar Profissional</h1>
      
      <div style={pageStyles.containerPadding}>
        
        <UserForm
          userToEdit={user}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </Container>
  );
};

export default UserEdit;