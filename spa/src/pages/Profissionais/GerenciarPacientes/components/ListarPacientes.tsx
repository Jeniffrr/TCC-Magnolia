import React, { useState, useEffect } from "react";
import { BrButton, Container } from "@govbr-ds/react-components";
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumbs";
import { pageStyles } from "../../../../assets/style/pageStyles";
import AppLayout from "../../../../components/Layout/AppLayout";
import api from "../../../../api/axios";
import type { PacienteResumo } from "../../../../types/paciente";
import { Loading } from '../../../../components/Loading/Loading';
import "../style.css";

interface PacienteListaProps {
  onVerPaciente: (pacienteId: number) => void;
  onEditarPaciente: (pacienteId: number) => void;
  onNovaAdmissao: () => void;
}

const BREADCRUMB_ITEMS = [
  { label: "", url: "/profissionais" },
  { label: "Gerenciar Pacientes", active: true },
];

const PacienteLista: React.FC<PacienteListaProps> = ({
  onVerPaciente,
  onEditarPaciente,
  onNovaAdmissao,
}) => {
  const [pacientes, setPacientes] = useState<PacienteResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const fetchPacientes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/pacientes?page=${currentPage}`);
        setPacientes(response.data.data || []);
        setCurrentPage(response.data.current_page || 1);
        setLastPage(response.data.last_page || 1);
      } catch {
        setError("Falha ao carregar lista de pacientes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPacientes();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  if (error) {
    return (
      <AppLayout>
        <Container fluid>
          <div className="error">{error}</div>
        </Container>
      </AppLayout>
    );
  }

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

        <h1 style={pageStyles.title}>Gerenciar Pacientes</h1>

        <div style={pageStyles.containerPadding}>
          <BrButton
            onClick={onNovaAdmissao}
            style={pageStyles.primaryButton}
            icon="fas fa-user-plus"
          >
            <span style={{ marginLeft: "8px" }}>Nova Admissão</span>
          </BrButton>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">Nome</th>
                  <th className="table-header">CPF</th>
                  <th className="table-header">Data Nascimento</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                      <Loading message="Carregando pacientes..." />
                    </td>
                  </tr>
                ) : (
                  pacientes?.map((paciente) => {
                    const internacaoAtiva = paciente.internacoes_ativas?.[0];
                    return (
                      <tr key={paciente.id} className="table-row">
                        <td className="table-cell">
                          <div className="user-name">
                            {paciente.nome_completo}
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="badge">{paciente.cpf}</span>
                        </td>
                        <td className="table-cell">
                          {new Date(
                            paciente.data_nascimento
                          ).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="table-cell">
                          {internacaoAtiva ? (
                            <span className="status-badge status-active">
                              INTERNADA - LEITO{" "}
                              {internacaoAtiva.leito?.numero || "N/A"}
                            </span>
                          ) : (
                            <span className="status-badge status-inactive">
                              SEM INTERNAÇÃO
                            </span>
                          )}
                        </td>
                        <td className="table-cell">
                          <div className="action-buttons">
                            <BrButton
                              onClick={() => onVerPaciente(paciente.id)}
                              className="view-button"
                              title="Visualizar informações do paciente"
                              icon="fas fa-eye"
                            />
                            <BrButton
                              onClick={() => onEditarPaciente(paciente.id)}
                              className="edit-button"
                              title="Editar paciente"
                              icon="pencil-alt"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <BrButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
              icon="chevron-left"
            />
            <span className="pagination-info">
              Página {currentPage} de {lastPage}
            </span>
            <BrButton
              onClick={() => handlePageChange(currentPage + 1)}
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

export { PacienteLista };
