import React, { useState, useEffect } from "react";
import { BrButton, Container } from "@govbr-ds/react-components";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumbs";
import BrInputIcon from "../../../../components/BrInputIcon/BrInputIcon";
import AppLayout from "../../../../components/Layout/AppLayout";
import {
  pageStyles,
  getFieldStatus,
  getFeedbackText,
} from "../../../../assets/style/pageStyles";
import { Loading } from "../../../../components/Loading/Loading";
import api from "../../../../api/axios";
import {
  applyCpfMask,
  applyPhoneMask,
  applyCepMask,
  validateCpf,
} from "../../../../utils/masks";
import "../style.css";

interface CondicaoPatologica {
  id: number;
  nome: string;
}

interface GestacaoAnterior {
  ano_parto: string;
  tipo_parto: string;
  observacoes: string;
}

interface GestacaoAnteriorAPI {
  ano_parto?: number | string;
  tipo_parto?: string;
  observacoes?: string;
}

interface PacienteFormData {
  nome_completo: string;
  cpf: string;
  nome_mae: string;
  data_nascimento: string;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  alergias: string;
  medicamentos_continuos: string;
  condicoes_patologicas: number[];
  gestacoes_anteriores: GestacaoAnterior[];
}

const BREADCRUMB_ITEMS = [
  { label: "", url: "/profissionais" },
  { label: "Gerenciar Pacientes", url: "/profissionais/pacientes" },
  { label: "Editar Paciente", active: true },
];

const PacienteEditar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PacienteFormData>({
    nome_completo: "",
    cpf: "",
    nome_mae: "",
    data_nascimento: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    alergias: "",
    medicamentos_continuos: "",
    condicoes_patologicas: [],
    gestacoes_anteriores: [],
  });

  const [condicoes, setCondicoes] = useState<CondicaoPatologica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [apiError, setApiError] = useState<string | null>(null);

  // --- MUDANÇA #1 ---
  // useEffect otimizado para buscar paciente por ID e dados de dropdown
  // de forma paralela, com tratamento de erro.
  useEffect(() => {
    if (!id) return;

    const loadAllData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        // Busca o paciente específico e as condições em paralelo
        const [pacienteRes, condicoesRes] = await Promise.all([
          api.get(`/api/pacientes/${id}`),
          api.get("/api/condicoes-patologicas"),
        ]);

        // A API show retorna o paciente diretamente
        const pacienteData = pacienteRes.data;

        if (!pacienteData) {
          throw new Error("Paciente não encontrado");
        }

        // Popula o formulário com os dados do paciente
        setFormData({
          nome_completo: pacienteData.nome_completo || "",
          cpf: applyCpfMask(pacienteData.cpf || ""),
          nome_mae: pacienteData.nome_mae || "",
          data_nascimento: pacienteData.data_nascimento || "",
          telefone: applyPhoneMask(pacienteData.telefone || ""),
          rua: pacienteData.rua || "",
          numero: pacienteData.numero || "",
          bairro: pacienteData.bairro || "",
          cidade: pacienteData.cidade || "",
          estado: pacienteData.estado || "",
          cep: applyCepMask(pacienteData.cep || ""),
          alergias: pacienteData.alergias || "",
          medicamentos_continuos: pacienteData.medicamentos_continuos || "",
          condicoes_patologicas: Array.isArray(
            pacienteData.condicoes_patologicas
          )
            ? pacienteData.condicoes_patologicas.map(
                (c: { id: number }) => c.id
              )
            : [],
          gestacoes_anteriores: Array.isArray(pacienteData.gestacoes_anteriores)
            ? pacienteData.gestacoes_anteriores.map(
                (g: GestacaoAnteriorAPI) => ({
                  ano_parto: g.ano_parto?.toString() || "",
                  tipo_parto: g.tipo_parto || "",
                  observacoes: g.observacoes || "",
                })
              )
            : [],
        });

        // Popula os dropdowns
        setCondicoes(condicoesRes.data || []);
      } catch (err: unknown) {
        const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
        console.error("Erro ao carregar dados:", err);
        if (error.response?.status === 404) {
          setApiError("Paciente não encontrado");
        } else if (error.response?.status === 401) {
          setApiError("Sessão expirada. Faça login novamente");
        } else {
          setApiError(error.response?.data?.message || error.message || "Erro ao carregar dados. Tente recarregar a página");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "cpf") {
      maskedValue = applyCpfMask(value);
      if (maskedValue.replace(/\D/g, "").length === 11 && !validateCpf(maskedValue)) {
        setValidationErrors(prev => ({ ...prev, cpf: "CPF inválido" }));
      } else {
        setValidationErrors(prev => ({ ...prev, cpf: "" }));
      }
    } else if (name === "telefone") {
      maskedValue = applyPhoneMask(value);
    } else if (name === "cep") {
      maskedValue = applyCepMask(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: maskedValue,
    }));
  };

  const addGestacao = () => {
    setFormData((prev) => ({
      ...prev,
      gestacoes_anteriores: [
        ...prev.gestacoes_anteriores,
        { ano_parto: "", tipo_parto: "", observacoes: "" },
      ],
    }));
  };

  const removeGestacao = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gestacoes_anteriores: prev.gestacoes_anteriores.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateGestacao = (
    index: number,
    field: keyof GestacaoAnterior,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      gestacoes_anteriores: prev.gestacoes_anteriores.map((gestacao, i) =>
        i === index ? { ...gestacao, [field]: value } : gestacao
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setApiError(null);
    setValidationErrors({});

    // --- MUDANÇA #3 ---
    // Payload corrigido para incluir TODOS os campos do formulário
    // que devem ser atualizados.
    const payload = {
      // Dados Pessoais
      nome_completo: formData.nome_completo,
      nome_mae: formData.nome_mae,
      telefone: formData.telefone.replace(/[^0-9]/g, ""),

      // Endereço
      rua: formData.rua,
      numero: formData.numero,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      cep: formData.cep.replace(/[^0-9]/g, ""),

      // Histórico Médico
      alergias: formData.alergias,
      medicamentos_continuos: formData.medicamentos_continuos,
      condicoes_patologicas: formData.condicoes_patologicas,
      gestacoes_anteriores: formData.gestacoes_anteriores.map((g) => ({
        ano_parto: g.ano_parto ? parseInt(g.ano_parto, 10) : null,
        tipo_parto: g.tipo_parto,
        observacoes: g.observacoes,
      })),
    };

    try {
      await api.put(`/api/pacientes/${id}`, payload);
      alert("Paciente atualizado com sucesso!");
      navigate("/profissionais/pacientes");
    } catch (err: unknown) {
      const error = err as {
        response?: {
          status?: number;
          data?: { errors?: Record<string, string[]>; message?: string };
        };
      };
      if (error.response && error.response.status === 422) {
        const errors = error.response.data?.errors || {};
        const flatErrors: Record<string, string> = {};
        Object.keys(errors).forEach((key) => {
          flatErrors[key] = Array.isArray(errors[key])
            ? errors[key][0]
            : errors[key];
        });
        setValidationErrors(flatErrors);
        setApiError("Formulário contém erros. Verifique os campos.");
      } else {
        setApiError(
          error.response?.data?.message ||
            "Ocorreu um erro ao salvar. Tente novamente."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

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
          Editando: {isLoading ? 'Carregando...' : formData.nome_completo || "Paciente"}
        </h1>

        <div style={pageStyles.containerPadding}>
          {isLoading ? (
            <Loading message="Carregando dados do paciente..." />
          ) : (
            <>
            {apiError && (
              <div className="alert-card error">
                <i className="fas fa-exclamation-triangle"></i>
                {apiError}
              </div>
            )}

            <div className="register-container">
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={pageStyles.sectionTitle}>Dados Pessoais</h3>
                <hr />

                <div className="admissao-flex-row">
                  <div className="admissao-field-xxlarge">
                    <BrInputIcon
                      label="Nome Completo*"
                      name="nome_completo"
                      type="text"
                      value={formData.nome_completo}
                      onChange={handleInputChange}
                      icon="fas fa-user"
                      status={getFieldStatus(validationErrors.nome_completo)}
                      feedbackText={getFeedbackText(
                        validationErrors.nome_completo
                      )}
                    />
                  </div>
                  <div className="admissao-field-small">
                    <BrInputIcon
                      label="CPF*"
                      name="cpf"
                      type="text"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      icon="fas fa-id-card"
                      disabled={true}
                      status={getFieldStatus(validationErrors.cpf)}
                      feedbackText={getFeedbackText(validationErrors.cpf)}
                    />
                  </div>
                </div>

                <div className="admissao-flex-row">
                  <div className="admissao-field-xlarge">
                    <label className="admissao-form-label">Data de Nascimento*</label>
                    <input
                      name="data_nascimento"
                      type="date"
                      value={formData.data_nascimento}
                      onChange={handleInputChange}
                      disabled={true}
                      className="admissao-form-input"
                      style={{ backgroundColor: "#ffffff", color: "#666" }}
                    />
                  </div>
                  <div className="admissao-field-large">
                    <BrInputIcon
                      label="Telefone"
                      name="telefone"
                      type="text"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      icon="fas fa-phone"
                      status={getFieldStatus(validationErrors.telefone)}
                      feedbackText={getFeedbackText(validationErrors.telefone)}
                    />
                  </div>
                </div>

                <div className="admissao-flex-row">
                  <div className="admissao-field-xlarge">
                    <BrInputIcon
                      label="Nome da Mãe*"
                      name="nome_mae"
                      type="text"
                      value={formData.nome_mae}
                      onChange={handleInputChange}
                      icon="fas fa-female"
                      status={getFieldStatus(validationErrors.nome_mae)}
                      feedbackText={getFeedbackText(validationErrors.nome_mae)}
                    />
                  </div>
                </div>

                <h3 style={pageStyles.sectionTitle}>Endereço</h3>
                <hr />

                <div className="admissao-flex-row">
                  <div className="admissao-field-medium">
                    <BrInputIcon
                      label="CEP"
                      name="cep"
                      type="text"
                      value={formData.cep}
                      onChange={handleInputChange}
                      icon="fas fa-map-pin"
                      status={getFieldStatus(validationErrors.cep)}
                      feedbackText={getFeedbackText(validationErrors.cep)}
                    />
                  </div>
                  <div className="admissao-field-xxlarge">
                    <BrInputIcon
                      label="Rua"
                      name="rua"
                      type="text"
                      value={formData.rua}
                      onChange={handleInputChange}
                      icon="fas fa-road"
                      status={getFieldStatus(validationErrors.rua)}
                      feedbackText={getFeedbackText(validationErrors.rua)}
                    />
                  </div>
                </div>

                <div className="admissao-flex-row">
                  <div className="admissao-field-small">
                    <BrInputIcon
                      label="Número"
                      name="numero"
                      type="text"
                      value={formData.numero}
                      onChange={handleInputChange}
                      icon="fas fa-hashtag"
                      status={getFieldStatus(validationErrors.numero)}
                      feedbackText={getFeedbackText(validationErrors.numero)}
                    />
                  </div>
                  <div className="admissao-field-xxlarge">
                    <BrInputIcon
                      label="Bairro"
                      name="bairro"
                      type="text"
                      value={formData.bairro}
                      onChange={handleInputChange}
                      icon="fas fa-map-marker-alt"
                      status={getFieldStatus(validationErrors.bairro)}
                      feedbackText={getFeedbackText(validationErrors.bairro)}
                    />
                  </div>
                </div>

                <div className="admissao-flex-row">
                  <div className="admissao-field-large">
                    <BrInputIcon
                      label="Cidade"
                      name="cidade"
                      type="text"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      icon="fas fa-city"
                      status={getFieldStatus(validationErrors.cidade)}
                      feedbackText={getFeedbackText(validationErrors.cidade)}
                    />
                  </div>
                  <div className="admissao-field-medium">
                    <BrInputIcon
                      label="Estado"
                      name="estado"
                      type="text"
                      value={formData.estado}
                      onChange={handleInputChange}
                      icon="fas fa-flag"
                      status={getFieldStatus(validationErrors.estado)}
                      feedbackText={getFeedbackText(validationErrors.estado)}
                    />
                  </div>
                </div>

                <h3 style={pageStyles.sectionTitle}>Histórico Médico</h3>
                <hr />

                <div style={{ marginBottom: "16px" }}>
                  <label className="admissao-form-label" style={{ marginBottom: "12px" }}>
                    Condições Patológicas
                  </label>
                  <div className="admissao-condicoes-grid">
                    {condicoes.map((cond) => (
                      <label
                        key={cond.id}
                        className="admissao-checkbox-label"
                      >
                        <input
                          type="checkbox"
                          checked={formData.condicoes_patologicas.includes(
                            cond.id
                          )}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              condicoes_patologicas: isChecked
                                ? [...prev.condicoes_patologicas, cond.id]
                                : prev.condicoes_patologicas.filter(
                                    (id) => id !== cond.id
                                  ),
                            }));
                          }}
                          className="admissao-checkbox"
                        />
                        <span>{cond.nome}</span>
                      </label>
                    ))}
                  </div>
                  {validationErrors.condicoes_patologicas && (
                    <div className="admissao-error-text">
                      {validationErrors.condicoes_patologicas}
                    </div>
                  )}
                </div>

                <div className="admissao-flex-row-margin">
                  <div className="admissao-field-xlarge">
                    <label className="admissao-form-label">Alergias</label>
                    <textarea
                      name="alergias"
                      value={formData.alergias}
                      onChange={handleInputChange}
                      rows={4}
                      className="admissao-form-container"
                    />
                  </div>
                </div>

                <div className="admissao-flex-row-margin">
                  <div className="admissao-field-xlarge">
                    <label className="admissao-form-label">
                      Medicamentos de Uso Contínuo
                    </label>
                    <textarea
                      name="medicamentos_continuos"
                      value={formData.medicamentos_continuos}
                      onChange={handleInputChange}
                      rows={4}
                      className="admissao-form-container"
                    />
                  </div>
                </div>

                <h3 style={pageStyles.userSectionTitle}>
                  Gestações Anteriores
                </h3>
                <hr />

                <div style={{ marginBottom: "16px" }}>
                  <div className="admissao-gestacao-header">
                    <label className="admissao-form-label">
                      Histórico de Gestações
                    </label>
                    <BrButton
                      type="button"
                      onClick={addGestacao}
                      style={pageStyles.primaryButton}
                    >
                      Adicionar Gestação
                    </BrButton>
                  </div>

                  {formData.gestacoes_anteriores.map((gestacao, index) => (
                    <div key={index} className="admissao-gestacao-card">
                      <div className="admissao-gestacao-card-header">
                        <h4 className="admissao-gestacao-title">
                          Gestação {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeGestacao(index)}
                          className="admissao-remove-button"
                        >
                          Remover
                        </button>
                      </div>

                      <div className="admissao-flex-row">
                        <div className="admissao-gestacao-field">
                          <label className="admissao-gestacao-label">
                            Ano do Parto
                          </label>
                          <input
                            type="text"
                            value={gestacao.ano_parto}
                            onChange={(e) =>
                              updateGestacao(index, "ano_parto", e.target.value)
                            }
                            placeholder="Ex: 2020"
                            className="admissao-gestacao-input"
                          />
                        </div>

                        <div className="admissao-gestacao-field-medium">
                          <label className="admissao-gestacao-label">
                            Tipo de Parto
                          </label>
                          <select
                            value={gestacao.tipo_parto}
                            onChange={(e) =>
                              updateGestacao(
                                index,
                                "tipo_parto",
                                e.target.value
                              )
                            }
                            className="admissao-gestacao-input"
                          >
                            <option value="">Selecione...</option>
                            <option value="Normal">Normal</option>
                            <option value="Cesárea">Cesárea</option>
                            <option value="Fórceps">Fórceps</option>
                            <option value="Aborto">Aborto</option>
                          </select>
                        </div>
                      </div>

                      <div className="admissao-gestacao-field-large" style={{ marginTop: "16px" }}>
                        <label className="admissao-gestacao-label" style={{ fontWeight: "600" }}>
                          Observações
                        </label>
                        <textarea
                          value={gestacao.observacoes}
                          onChange={(e) =>
                            updateGestacao(index, "observacoes", e.target.value)
                          }
                          rows={2}
                          className="admissao-gestacao-textarea"
                        />
                      </div>
                    </div>
                  ))}

                  {formData.gestacoes_anteriores.length === 0 && (
                    <div className="admissao-empty-state">
                      Nenhuma gestação anterior cadastrada. Clique em "Adicionar
                      Gestação" para incluir o histórico.
                    </div>
                  )}
                </div>

                <div style={pageStyles.buttonContainer}>
                  <BrButton
                    type="button"
                    onClick={() => navigate("/profissionais/pacientes")}
                    className="back-button"
                    disabled={isSaving}
                  >
                    Cancelar
                  </BrButton>
                  <BrButton
                    type="submit"
                    className="register-button"
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </BrButton>
                </div>
              </form>
            </div>
            </>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default PacienteEditar;
