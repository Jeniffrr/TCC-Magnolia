import React from 'react';
import { BrButton, Container } from '@govbr-ds/react-components';
import BrHeader from '../../../../components/Header/BrHeader';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../../assets/style/pageStyles';
import type { Usuario } from '../../../../services/adminService';

interface UserListProps {
  usuarios: Usuario[];
  currentPage: number;
  lastPage: number;
  onNewUser: () => void;
  onViewUser: (user: Usuario) => void;
  onEditUser: (user: Usuario) => void;
  onToggleStatus: (userId: number) => void;
  onDeleteUser: (userId: number, userName: string) => void;
  onPageChange: (page: number) => void;
}

const BREADCRUMB_ITEMS = [
  { label: "", url: "/" },
  { label: "Gerenciar Profissionais de Saude", active: true },
];

const UserList: React.FC<UserListProps> = ({
  usuarios,
  currentPage,
  lastPage,
  onNewUser,
  onViewUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  onPageChange,
}) => {
  return (
    <Container fluid>
      <BrHeader />
      <div className="mb-3 mt-3">
        <Breadcrumb
          items={BREADCRUMB_ITEMS}
          homeIcon={true}
          className="custom-breadcrumb"
        />
      </div>
      
      <h1 style={pageStyles.title}>
        Gerenciamento de Profissionais de Saúde
      </h1>
      
      <div style={pageStyles.containerPadding}>
        <div className="button">
          <BrButton
            onClick={onNewUser}
            style={pageStyles.primaryButton}
            icon="fas fa-user-plus"
          >
            <span style={{ marginLeft: '8px' }}>Cadastrar Novo Profissional</span>
          </BrButton>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header">Nome</th>
                <th className="table-header">Função</th>
                <th className="table-header">Registro</th>
                <th className="table-header">Status</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="user-name">{user.nome}</div>
                    <div className="user-email">{user.email}</div>
                  </td>
                  <td className="table-cell">
                    <span className="badge">
                      {user.tipo_usuario.toUpperCase()}
                    </span>
                  </td>
                  <td className="table-cell">
                    {user.tipo_registro} - {user.numero_registro}
                    <br />
                    <small className="small-text">{user.uf_registro}</small>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`status-badge ${
                        user.is_active ? "status-active" : "status-inactive"
                      }`}
                    >
                      {user.is_active ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <BrButton
                        onClick={() => onViewUser(user)}
                        className="view-button"
                        title="Visualizar usuário"
                        icon="fas fa-eye"
                      />
                      <BrButton
                        onClick={() => onEditUser(user)}
                        className="edit-button"
                        title="Editar usuário"
                        icon="pencil-alt"
                      />
                      <BrButton
                        onClick={() => onToggleStatus(user.id)}
                        className={`toggle-button ${
                          user.is_active ? "deactivate" : "activate"
                        }`}
                        title={
                          user.is_active
                            ? "Desativar usuário"
                            : "Ativar usuário"
                        }
                        icon={user.is_active ? "fas fa-ban" : "fas fa-check"}
                      />
                      <BrButton
                        onClick={() => onDeleteUser(user.id, user.nome)}
                        className="delete-button"
                        title="Excluir usuário"
                        icon="trash"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <BrButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
            icon="chevron-left"
          />
          <span className="pagination-info">
            Página {currentPage} de {lastPage}
          </span>
          <BrButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="pagination-button"
            icon="chevron-right"
          />
        </div>
      </div>
    </Container>
  );
};

export default UserList;