import React, { useState, useEffect, useCallback } from "react";
import {
  getUsuarios,
  toggleUsuarioStatus,
  deleteUsuario,
} from "../../../services/adminService";
import type { Usuario } from "../../../services/adminService";
import UserList from "./components/UserList";
import UserView from "./components/UserView";
import UserCreate from "./components/UserCreate";
import UserEdit from "./components/UserEdit";
import Modal from "../../../components/Modal/Modal";
import { useModal } from "../../../hooks/useModal";
import {
  getCachedUsuarios,
  setCachedUsuarios,
  clearUsuariosCache,
} from "../../../utils/formDataCache";
import "./styles.css";

const GerenciarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "new" | "view" | Usuario>("list");
  const { modal, showAlert, showConfirm, closeModal } = useModal();

  // Função que carrega os dados do backend com cache
  const fetchUsuarios = useCallback(async (page: number) => {
    // Verifica cache primeiro
    const cachedData = getCachedUsuarios(page);
    if (cachedData) {
      setUsuarios(cachedData.data);
      setCurrentPage(cachedData.current_page);
      setLastPage(cachedData.last_page);
      return;
    }

    // Só mostra loading se não tem cache
    setLoading(true);
    setError(null);
    try {
      const data = await getUsuarios(page);

      // Salva no cache
      setCachedUsuarios(page, {
        data: data.data,
        current_page: data.current_page,
        last_page: data.last_page,
      });

      setUsuarios(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Erro ao carregar dados. Verifique a autenticação.";
      setError(msg);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lógica para Desativar/Ativar
  const handleToggleStatus = async (userId: number) => {
    const usuario = usuarios.find((u) => u.id === userId);
    if (!usuario) {
      return;
    }

    const confirmed = await showConfirm(
      "Confirmar Alteração",
      `Tem certeza que deseja ${
        usuario.is_active ? "DESATIVAR" : "ATIVAR"
      } o usuário ${usuario.nome}?`,
      usuario.is_active ? "Desativar" : "Ativar",
      "Cancelar"
    );

    if (!confirmed) {
      return;
    }

    try {
      await toggleUsuarioStatus(userId);
      clearUsuariosCache(); // Limpa cache após alteração
      // Atualiza o estado da tabela localmente
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_active: !u.is_active } : u
        )
      );
    } catch (err: unknown) {
      await showAlert(
        "Erro",
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Falha ao alterar o status."
      );
    }
  };

  // Lógica para Excluir
  const handleDelete = async (userId: number, userName: string) => {
    const confirmed = await showConfirm(
      "Confirmar Exclusão",
      `AVISO: Remover permanentemente o usuário ${userName}?`,
      "Excluir",
      "Cancelar"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUsuario(userId);
      await showAlert("Sucesso", `Usuário ${userName} excluído com sucesso.`);
      clearUsuariosCache(); // Limpa cache após exclusão
      fetchUsuarios(currentPage);
    } catch (err: unknown) {
      await showAlert(
        "Erro",
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Falha na exclusão."
      );
    }
  };

  // Função de sucesso do formulário: Volta para a listagem e recarrega
  const handleFormSuccess = () => {
    clearUsuariosCache(); // Limpa cache após modificação
    setMode("list");
    fetchUsuarios(currentPage);
  };

  // FUNÇÕES PARA MUDAR O MODO:
  const startNewUser = () => setMode("new");
  const startEditUser = (user: Usuario) => setMode(user);
  const cancelForm = () => setMode("list");

  // Estado para usuário sendo visualizado
  const [viewingUser, setViewingUser] = useState<Usuario | null>(null);

  // Função para visualizar usuário
  const handleViewUser = (user: Usuario) => {
    setViewingUser(user);
    setMode("view");
  };

  // Função para mudança de página
  const handlePageChange = (page: number) => {
    fetchUsuarios(page);
  };

  // Carregar usuários na montagem do componente
  useEffect(() => {
    fetchUsuarios(currentPage);
  }, [fetchUsuarios, currentPage]);

  // Checagem básica de autenticação
  if (!localStorage.getItem("auth_token")) {
    return (
      <p className="error">
        Acesso negado. Por favor, faça login como administrador.
      </p>
    );
  }

  if (error && mode === "list") return <p className="error">Erro: {error}</p>;

  // SE ESTIVER NO MODO VISUALIZAÇÃO
  if (mode === "view" && viewingUser) {
    return <UserView user={viewingUser} onBack={cancelForm} />;
  }

  // SE ESTIVER NO MODO CADASTRO
  if (mode === "new") {
    return <UserCreate onSuccess={handleFormSuccess} onCancel={cancelForm} />;
  }

  // SE ESTIVER NO MODO EDIÇÃO
  if (typeof mode === "object") {
    return (
      <UserEdit
        user={mode}
        onSuccess={handleFormSuccess}
        onCancel={cancelForm}
      />
    );
  }

  // SE ESTIVER NO MODO LISTAGEM
  return (
    <>
      <UserList
        usuarios={usuarios}
        currentPage={currentPage}
        lastPage={lastPage}
        onNewUser={startNewUser}
        onViewUser={handleViewUser}
        onEditUser={startEditUser}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDelete}
        onPageChange={handlePageChange}
        loading={loading}
      />
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />
    </>
  );
};

export default GerenciarUsuarios;
