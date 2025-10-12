import React from 'react';
import { BrButton } from '@govbr-ds/react-components';
import AppLayout from '../../../../components/Layout/AppLayout';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../../assets/style/pageStyles';
import type { Usuario } from '../../../../services/adminService';

interface UserViewProps {
  user: Usuario;
  onBack: () => void;
}

const UserView: React.FC<UserViewProps> = ({ user, onBack }) => {
  const breadcrumbItems = [
    { label: '', url: '/admin' },
    { label: 'Gerenciar Profissionais', url: '/admin/usuarios' },
    { label: 'Visualizar Profissional', active: true }
  ];
  return (
    <AppLayout>
      <div className="container-fluid">
      <div className="mb-3 mt-3">
        <Breadcrumb items={breadcrumbItems} homeIcon={true} />
      </div>
      
      <h1 style={pageStyles.title}>Visualizar Profissional</h1>
      
      <div style={pageStyles.containerPadding}>
        <div className="view-container">
          <div className="view-section">
            <h3>Dados Pessoais</h3>
            <div className="view-field">
              <label>Nome:</label>
              <span>{user.nome}</span>
            </div>
            <div className="view-field">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="view-field">
              <label>Tipo de Usuário:</label>
              <span>{user.tipo_usuario}</span>
            </div>
            <div className="view-field">
              <label>Registro Profissional:</label>
              <span>{user.tipo_registro} - {user.numero_registro || 'N/A'}</span>
            </div>
            <div className="view-field">
              <label>UF do Registro:</label>
              <span>{user.uf_registro || 'N/A'}</span>
            </div>
            <div className="view-field">
              <label>Status:</label>
              <span className={`status-badge ${user.is_active ? 'status-active' : 'status-inactive'}`}>
                {user.is_active ? 'ATIVO' : 'INATIVO'}
              </span>
            </div>
          </div>
          <div className="view-actions">
            <BrButton onClick={onBack} className="back-button">
              Voltar
            </BrButton>
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
};

export default UserView;