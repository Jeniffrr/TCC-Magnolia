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
import api from "../../../../api/axios";
import {
  applyCpfMask,
  applyPhoneMask,
  applyCepMask,
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
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setApiError(
          "Ocorreu um erro ao buscar os dados da paciente. Tente recarregar a página."
        );
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

  // Estilo simples para os novos campos
  const formElementStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "#fff",
    color: "#333",
  };

  const formLabelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
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
          Editando: {formData.nome_completo || "Paciente"}
        </h1>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Carregando dados do paciente...
          </div>
        ) : (
          <div style={pageStyles.containerPadding}>
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

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "2", minWidth: "800px" }}>
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
                  <div style={{ flex: "1", minWidth: "100px" }} >
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

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "300px" }}>
                    <label style={formLabelStyle}>Data de Nascimento*</label>
                    <input
                      name="data_nascimento"
                      type="date"
                      value={formData.data_nascimento}
                      onChange={handleInputChange}
                      disabled={true}
                      style={{
                        ...formElementStyle,
                        width: "95%",
                        backgroundColor: "#ffffff",
                        color: "#666",
                      }}
                    />
                  </div>
                  <div style={{ flex: "1", minWidth: "200px" }}>
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

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "300px" }}>
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

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "150px" }}>
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
                  <div style={{ flex: "2", minWidth: "300px" }}>
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

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "100px" }}>
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
                  <div style={{ flex: "1", minWidth: "800px" }}>
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

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "200px" }}>
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
                  <div style={{ flex: "1", minWidth: "150px" }}>
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
                  <label
                    style={{
                      display: "block",
                      marginBottom: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
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
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.condicoes_patologicas}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ flex: "1", minWidth: "300px" }}>
                    <label style={formLabelStyle}>Alergias</label>
                    <textarea
                      name="alergias"
                      value={formData.alergias}
                      onChange={handleInputChange}
                      rows={4}
                      style={{ ...formElementStyle, resize: "vertical" }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ flex: "1", minWidth: "300px" }}>
                    <label style={formLabelStyle}>
                      Medicamentos de Uso Contínuo
                    </label>
                    <textarea
                      name="medicamentos_continuos"
                      value={formData.medicamentos_continuos}
                      onChange={handleInputChange}
                      rows={4}
                      style={{ ...formElementStyle, resize: "vertical" }}
                    />
                  </div>
                </div>

                <h3 style={pageStyles.userSectionTitle}>
                  Gestações Anteriores
                </h3>
                <hr />

                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
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

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ flex: "1", minWidth: "120px" }}>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "4px",
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Ano do Parto
                          </label>
                          <input
                            type="text"
                            value={gestacao.ano_parto}
                            onChange={(e) =>
                              updateGestacao(index, "ano_parto", e.target.value)
                            }
                            placeholder="Ex: 2020"
                            style={{
                              width: "95%",
                              padding: "16px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              fontSize: "13px",
                            }}
                          />
                        </div>

                        <div style={{ flex: "1", minWidth: "150px" }}>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "4px",
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
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
                            style={{
                              width: "95%",
                              padding: "16px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              fontSize: "13px",
                            }}
                          >
                            <option value="">Selecione...</option>
                            <option value="Normal">Normal</option>
                            <option value="Cesárea">Cesárea</option>
                            <option value="Fórceps">Fórceps</option>
                            <option value="Aborto">Aborto</option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          flex: "1",
                          minWidth: "300px",
                          marginTop: "16px",
                        }}
                      >
                        <label
                          style={{
                            display: "block",
                            marginBottom: "4px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          Observações
                        </label>
                        <textarea
                          value={gestacao.observacoes}
                          onChange={(e) =>
                            updateGestacao(index, "observacoes", e.target.value)
                          }
                          rows={2}
                          style={{
                            width: "95%",
                            padding: "12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "14px",
                            resize: "vertical",
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {formData.gestacoes_anteriores.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#666",
                        fontStyle: "italic",
                        border: "2px dashed #ddd",
                        borderRadius: "8px",
                      }}
                    >
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
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

export default PacienteEditar;
