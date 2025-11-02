import React, { useState, useEffect, useCallback } from "react";
import { getLeitos, deleteLeito } from "../../../services/leitoService";
import type { Leito } from "../../../services/leitoService";
import LeitoList from "./components/LeitoList";
import LeitoView from "./components/LeitoView";
import LeitoCreate from "./components/LeitoCreate";
import LeitoEdit from "./components/LeitoEdit";
import Modal from "../../../components/Modal/Modal";
import { useModal } from "../../../hooks/useModal";
import {
  getCachedLeitos,
  setCachedLeitos,
  clearLeitosCache,
} from "../../../utils/formDataCache";
import "./styles.css";

const GerenciarLeitos: React.FC = () => {
  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "new" | "view" | Leito>("list");
  const { modal, showAlert, showConfirm, closeModal } = useModal();

  // Função que carrega os dados do backend com cache
  const fetchLeitos = useCallback(async (page: number) => {
    // Verifica cache primeiro
    const cachedData = getCachedLeitos(page);
    if (cachedData) {
      setLeitos(cachedData.data);
      setCurrentPage(cachedData.current_page);
      setLastPage(cachedData.last_page);
      return;
    }

    // Só mostra loading se não tem cache
    setLoading(true);
    setError(null);
    try {
      const data = await getLeitos(page);

      // Salva no cache
      setCachedLeitos(page, {
        data: data.data,
        current_page: data.current_page,
        last_page: data.last_page,
      });

      setLeitos(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Erro ao carregar dados. Verifique a autenticação.";
      setError(msg);
      setLeitos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lógica para Excluir
  const handleDelete = async (leitoId: number, leitoNumero: string) => {
    const confirmed = await showConfirm(
      "Confirmar Exclusão",
      `Deseja excluir permanentemente o leito ${leitoNumero}?`,
      "Excluir",
      "Cancelar"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteLeito(leitoId);
      await showAlert("Sucesso", `Leito ${leitoNumero} excluído com sucesso.`);
      clearLeitosCache(); // Limpa cache após exclusão
      fetchLeitos(currentPage);
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
    clearLeitosCache(); // Limpa cache após modificação
    setMode("list");
    fetchLeitos(currentPage);
  };

  // FUNÇÕES PARA MUDAR O MODO:
  const startNewLeito = () => setMode("new");
  const startEditLeito = (leito: Leito) => setMode(leito);
  const cancelForm = () => setMode("list");

  // Estado para leito sendo visualizado
  const [viewingLeito, setViewingLeito] = useState<Leito | null>(null);

  // Função para visualizar leito
  const handleViewLeito = (leito: Leito) => {
    setViewingLeito(leito);
    setMode("view");
  };

  // Função para mudança de página
  const handlePageChange = (page: number) => {
    fetchLeitos(page);
  };

  // Carregar leitos na montagem do componente
  useEffect(() => {
    fetchLeitos(currentPage);
  }, [fetchLeitos, currentPage]);

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
  if (mode === "view" && viewingLeito) {
    return <LeitoView leito={viewingLeito} onBack={cancelForm} />;
  }

  // SE ESTIVER NO MODO CADASTRO
  if (mode === "new") {
    return <LeitoCreate onSuccess={handleFormSuccess} onCancel={cancelForm} />;
  }

  // SE ESTIVER NO MODO EDIÇÃO
  if (typeof mode === "object") {
    return (
      <LeitoEdit
        leito={mode}
        onSuccess={handleFormSuccess}
        onCancel={cancelForm}
      />
    );
  }

  // SE ESTIVER NO MODO LISTAGEM
  return (
    <>
      <LeitoList
        leitos={leitos}
        currentPage={currentPage}
        lastPage={lastPage}
        onNewLeito={startNewLeito}
        onViewLeito={handleViewLeito}
        onEditLeito={startEditLeito}
        onDeleteLeito={handleDelete}
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

export default GerenciarLeitos;
