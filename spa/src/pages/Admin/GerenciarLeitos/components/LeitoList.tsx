import React from 'react';
import { BrButton, Container } from '@govbr-ds/react-components';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../../../../assets/style/pageStyles';
import type { Leito } from '../../../../services/leitoService';
import AppLayout from '../../../../components/Layout/AppLayout';
import { Loading } from '../../../../components/Loading/Loading';

const BREADCRUMB_ITEMS = [
  { label: "", url: "/admin" },
  { label: "Gerenciar Leitos", active: true },
];

interface LeitoListProps {
  leitos: Leito[];
  currentPage: number;
  lastPage: number;
  loading?: boolean;
  onNewLeito: () => void;
  onViewLeito: (leito: Leito) => void;
  onEditLeito: (leito: Leito) => void;
  onDeleteLeito: (leitoId: number, leitoNumero: string) => void;
  onPageChange: (page: number) => void;
}

const LeitoList: React.FC<LeitoListProps> = ({
  leitos,
  currentPage,
  lastPage,
  loading = false,
  onNewLeito,
  onViewLeito,
  onEditLeito,
  onDeleteLeito,
  onPageChange,
}) => {
  return (
    <AppLayout>
      <Container fluid>
        <div className="mb-3 mt-3">
          <Breadcrumb
            items={BREADCRUMB_ITEMS}
            homeIcon={true}
            className="custom-breadcrumb"
          />
        </div>
        
        <h1 style={pageStyles.title}>
          Gerenciar Leitos
        </h1>
        
        <div style={pageStyles.containerPadding}>
          <div className="button">
            <BrButton
              onClick={onNewLeito}
              style={pageStyles.primaryButton}
              icon="fas fa-bed"
            >
              <span style={{ marginLeft: '8px' }}>Cadastrar Novo Leito</span>
            </BrButton>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">Leito</th>
                  <th className="table-header">Tipo</th>
                  <th className="table-header">Capacidade</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              {loading && (
                <tbody>
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      <Loading message="Carregando leitos..." />
                    </td>
                  </tr>
                </tbody>
              )}
              {!loading && (
              <tbody>
                {leitos.map((leito) => (
                  <tr key={leito.id} className="table-row">
                    <td className="table-cell">
                      <div className="user-name">Leito {leito.numero}</div>
                    </td>
                    <td className="table-cell">
                      <span className="badge">
                        {leito.tipo.toUpperCase()}
                      </span>
                    </td>
                    <td className="table-cell">
                      {leito.capacidade_maxima} {leito.capacidade_maxima === 1 ? 'pessoa' : 'pessoas'}
                    </td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <BrButton
                          onClick={() => onViewLeito(leito)}
                          className="view-button"
                          title="Visualizar leito"
                          icon="fas fa-eye"
                        />
                        <BrButton
                          onClick={() => onEditLeito(leito)}
                          className="edit-button"
                          title="Editar leito"
                          icon="pencil-alt"
                        />
                        <BrButton
                          onClick={() => onDeleteLeito(leito.id, leito.numero)}
                          className="delete-button"
                          title="Excluir leito"
                          icon="trash"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              )}
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
    </AppLayout>
  );
};

export default LeitoList;
