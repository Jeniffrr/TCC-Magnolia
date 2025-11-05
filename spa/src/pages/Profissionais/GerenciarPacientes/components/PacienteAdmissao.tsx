import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, BrButton } from "@govbr-ds/react-components";
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumbs";
import BrInputIcon from "../../../../components/BrInputIcon/BrInputIcon";
import AppLayout from "../../../../components/Layout/AppLayout";
import {
  pageStyles,
  getFieldStatus,
  getFeedbackText,
} from "../../../../assets/style/pageStyles";
import api from "../../../../api/axios";
import { applyCpfMask, applyPhoneMask, applyCepMask } from "../../../../utils/masks";
import "../style.css";

interface Leito {
  id: number;
  nome: string;
}

interface CondicaoPatologica {
  id: number;
  nome: string;
}

interface GestacaoAnterior {
  ano_parto: string;
  tipo_parto: string;
  observacoes: string;
}

interface PacienteAdmissaoFormData {
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
  consentimento_lgpd_aceito: boolean;
  leito_id: string;
  motivo_internacao: string;
  pressao_sistolica: string;
  pressao_diastolica: string;
  frequencia_cardiaca: string;
  temperatura: string;
  frequencia_respiratoria: string;
  evolucao_maternidade: string;
  avaliacao_fetal: string;
  bcf: string;
  movimentos_fetais_presentes: boolean | null;
  altura_uterina: string;
  condicoes_patologicas: number[];
  gestacoes_anteriores: GestacaoAnterior[];
}

const initialState: PacienteAdmissaoFormData = {
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
  consentimento_lgpd_aceito: false,
  leito_id: "",
  motivo_internacao: "",
  pressao_sistolica: "",
  pressao_diastolica: "",
  frequencia_cardiaca: "",
  temperatura: "",
  frequencia_respiratoria: "",
  evolucao_maternidade: "",
  avaliacao_fetal: "",
  bcf: "",
  movimentos_fetais_presentes: null,
  altura_uterina: "",
  condicoes_patologicas: [],
  gestacoes_anteriores: [],
};

const PacienteAdmissao: React.FC = () => {
  const [formData, setFormData] = useState<PacienteAdmissaoFormData>(initialState);
  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoPatologica[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();



  useEffect(() => {
    const loadDropdownData = async () => {
      setIsLoading(true);
      try {
        const [leitosRes, condicoesRes] = await Promise.all([
          api.get("/api/leitos"),
          api.get("/api/condicoes-patologicas"),
        ]);
        console.log("Leitos response:", leitosRes.data);
        console.log("Condições response:", condicoesRes.data);
        setLeitos(leitosRes.data.data || leitosRes.data || []);
        setCondicoes(condicoesRes.data || []);
      } catch {
        setApiError("Falha ao carregar dados do formulário.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDropdownData();
  }, []);

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
    } else if (name === "pressao_sistolica" || name === "pressao_diastolica") {
      const numericValue = value.replace(/[^0-9]/g, "");
      maskedValue = numericValue;
    } else if (name === "frequencia_cardiaca") {
      const numericValue = value.replace(/[^0-9]/g, "");
      maskedValue = numericValue;
    } else if (name === "frequencia_respiratoria") {
      const numericValue = value.replace(/[^0-9]/g, "");
      maskedValue = numericValue;
    } else if (name === "temperatura") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      maskedValue = numericValue;
    } else if (name === "bcf" || name === "altura_uterina") {
      const numericValue = value.replace(/[^0-9]/g, "");
      maskedValue = numericValue;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: maskedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);
    setValidationErrors({});

    const payload = {
      ...formData,
      cpf: formData.cpf.replace(/[^0-9]/g, ""),
      telefone: formData.telefone.replace(/[^0-9]/g, ""),
      cep: formData.cep.replace(/[^0-9]/g, ""),
      leito_id: Number(formData.leito_id),
      pressao_sistolica: Number(formData.pressao_sistolica) || null,
      pressao_diastolica: Number(formData.pressao_diastolica) || null,
      frequencia_cardiaca: Number(formData.frequencia_cardiaca) || null,
      temperatura: Number(formData.temperatura) || null,
      frequencia_respiratoria: Number(formData.frequencia_respiratoria) || null,
      bcf: Number(formData.bcf) || null,
      altura_uterina: Number(formData.altura_uterina) || null,
    };

    try {
      await api.post("/api/pacientes", payload);
      setShowSuccess(true);
      setFormData(initialState);
      setTimeout(() => navigate("/profissionais/pacientes"), 2000);
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
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialState);
    setValidationErrors({});
    setApiError(null);
    setShowSuccess(false);
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

  const BREADCRUMB_ITEMS = [
    { label: "", url: "/profissionais" },
    { label: "Gerenciar Pacientes", url: "/profissionais/pacientes" },
    { label: "Nova Admissão", active: true },
  ];

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

        <h1 style={pageStyles.title}>Admissão de Paciente</h1>

        <div style={pageStyles.containerPadding}>
          {showSuccess && (
            <div className="alert-card success">
              <i className="fas fa-check-circle"></i>
              Paciente admitida com sucesso!
            </div>
          )}

          {apiError && (
            <div className="alert-card error">
              <i className="fas fa-exclamation-triangle"></i>
              {apiError}
            </div>
          )}

          <div className="register-container">
            <form onSubmit={handleSubmit} noValidate>
              {/* Dados Pessoais */}
              <h3 style={pageStyles.sectionTitle}>Dados Pessoais</h3>
              <hr />

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
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
                <div style={{ flex: "1", minWidth: "100px" }}>
                  <BrInputIcon
                    label="CPF*"
                    name="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    icon="fas fa-id-card"
                    status={getFieldStatus(validationErrors.cpf)}
                    feedbackText={getFeedbackText(validationErrors.cpf)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "300px" }}>
                  <label className="admissao-form-label">
                    Data de Nascimento*
                  </label>
                  <input
                    name="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={handleInputChange}
                    className="admissao-form-input"
                  />
                  {validationErrors.data_nascimento && (
                    <div className="admissao-error-text">
                      {validationErrors.data_nascimento}
                    </div>
                  )}
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

              {/* Endereço */}
              <h3 style={pageStyles.userSectionTitle}>Endereço</h3>
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

              {/* Histórico Médico */}
              <h3 style={pageStyles.userSectionTitle}>Histórico Médico</h3>
              <hr />

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <div style={{ flex: "1", minWidth: "300px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Alergias
                  </label>
                  <textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: "98%",
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                  {validationErrors.alergias && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.alergias}
                    </div>
                  )}
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
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Medicamentos de Uso Contínuo
                  </label>
                  <textarea
                    name="medicamentos_continuos"
                    value={formData.medicamentos_continuos}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: "98%",
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                  {validationErrors.medicamentos_continuos && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.medicamentos_continuos}
                    </div>
                  )}
                </div>
              </div>

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

              {/* Gestações Anteriores */}
              <h3 style={pageStyles.userSectionTitle}>Gestações Anteriores</h3>
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
                      style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
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
                            updateGestacao(index, "tipo_parto", e.target.value)
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
                   
                      <div style={{ flex: "1", minWidth: "300px" , marginTop:"16px"}}>
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

              {/* Sinais Vitais */}
              <h3 style={pageStyles.userSectionTitle}>Sinais Vitais</h3>
              <hr />

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div
                  style={{ flex: "1", minWidth: "150px", position: "relative" }}
                >
                  <BrInputIcon
                    label="Pressão Sistólica"
                    name="pressao_sistolica"
                    type="text"
                    value={formData.pressao_sistolica}
                    onChange={handleInputChange}
                    icon="fas fa-heartbeat"
                    status={getFieldStatus(validationErrors.pressao_sistolica)}
                    feedbackText={getFeedbackText(
                      validationErrors.pressao_sistolica
                    )}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "38px",
                      fontSize: "14px",
                      color: "#666",
                      pointerEvents: "none",
                      backgroundColor: "white",
                      padding: "0 4px",
                    }}
                  >
                    mmHg
                  </span>
                </div>
                <div
                  style={{ flex: "1", minWidth: "150px", position: "relative" }}
                >
                  <BrInputIcon
                    label="Pressão Diastólica"
                    name="pressao_diastolica"
                    type="text"
                    value={formData.pressao_diastolica}
                    onChange={handleInputChange}
                    icon="fas fa-heartbeat"
                    status={getFieldStatus(validationErrors.pressao_diastolica)}
                    feedbackText={getFeedbackText(
                      validationErrors.pressao_diastolica
                    )}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "38px",
                      fontSize: "14px",
                      color: "#666",
                      pointerEvents: "none",
                      backgroundColor: "white",
                      padding: "0 4px",
                    }}
                  >
                    mmHg
                  </span>
                </div>
                <div
                  style={{ flex: "1", minWidth: "150px", position: "relative" }}
                >
                  <BrInputIcon
                    label="Frequência Cardíaca"
                    name="frequencia_cardiaca"
                    type="text"
                    value={formData.frequencia_cardiaca}
                    onChange={handleInputChange}
                    icon="fas fa-heart"
                    status={getFieldStatus(
                      validationErrors.frequencia_cardiaca
                    )}
                    feedbackText={getFeedbackText(
                      validationErrors.frequencia_cardiaca
                    )}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "38px",
                      fontSize: "14px",
                      color: "#666",
                      pointerEvents: "none",
                      backgroundColor: "white",
                      padding: "0 4px",
                    }}
                  >
                    bpm
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div
                  style={{ flex: "1", minWidth: "200px", position: "relative" }}
                >
                  <BrInputIcon
                    label="Temperatura"
                    name="temperatura"
                    type="text"
                    value={formData.temperatura}
                    onChange={handleInputChange}
                    icon="fas fa-thermometer-half"
                    status={getFieldStatus(validationErrors.temperatura)}
                    feedbackText={getFeedbackText(validationErrors.temperatura)}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "38px",
                      fontSize: "14px",
                      color: "#666",
                      pointerEvents: "none",
                      backgroundColor: "white",
                      padding: "0 4px",
                    }}
                  >
                    °C
                  </span>
                </div>
                <div
                  style={{ flex: "1", minWidth: "150px", position: "relative" }}
                >
                  <BrInputIcon
                    label="Frequência Respiratória"
                    name="frequencia_respiratoria"
                    type="text"
                    value={formData.frequencia_respiratoria}
                    onChange={handleInputChange}
                    icon="fas fa-lungs"
                    status={getFieldStatus(
                      validationErrors.frequencia_respiratoria
                    )}
                    feedbackText={getFeedbackText(
                      validationErrors.frequencia_respiratoria
                    )}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "38px",
                      fontSize: "14px",
                      color: "#666",
                      pointerEvents: "none",
                      backgroundColor: "white",
                      padding: "0 4px",
                    }}
                  >
                    rpm
                  </span>
                </div>
              </div>

              {/* Avaliação Obstétrica */}
              <h3 style={pageStyles.userSectionTitle}>Avaliação Obstétrica</h3>
              <hr />
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ flex: "1", minWidth: "150px", position: "relative" }}
                >
                  <BrInputIcon
                    label="BCF"
                    name="bcf"
                    type="text"
                    value={formData.bcf}
                    onChange={handleInputChange}
                    icon="fas fa-baby"
                    status={getFieldStatus(validationErrors.bcf)}
                    feedbackText={getFeedbackText(validationErrors.bcf)}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "38px",
                      fontSize: "14px",
                      color: "#666",
                      pointerEvents: "none",
                      backgroundColor: "white",
                      padding: "0 4px",
                    }}
                  >
                    bpm
                  </span>
                </div>
                <div
                  style={{ flex: "1", minWidth: "150px", position: "relative" }}
                >
                  <BrInputIcon
                    label="Altura Uterina"
                    name="altura_uterina"
                    type="text"
                    value={formData.altura_uterina}
                    onChange={handleInputChange}
                    icon="fas fa-ruler"
                    status={getFieldStatus(validationErrors.altura_uterina)}
                    feedbackText={getFeedbackText(
                      validationErrors.altura_uterina
                    )}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "38px",
                      fontSize: "14px",
                      color: "#666",
                      pointerEvents: "none",
                      backgroundColor: "white",
                      padding: "0 4px",
                    }}
                  >
                    cm
                  </span>
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
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Evolução Maternidade
                  </label>
                  <textarea
                    name="evolucao_maternidade"
                    value={formData.evolucao_maternidade}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: "98%",
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                  {validationErrors.evolucao_maternidade && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.evolucao_maternidade}
                    </div>
                  )}
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
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Avaliação Fetal
                  </label>
                  <textarea
                    name="avaliacao_fetal"
                    value={formData.avaliacao_fetal}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: "98%",
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                  {validationErrors.avaliacao_fetal && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.avaliacao_fetal}
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  flex: "1",
                  minWidth: "200px",
                  paddingBottom: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="movimentos_fetais_presentes"
                    checked={formData.movimentos_fetais_presentes === true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        movimentos_fetais_presentes: e.target.checked,
                      }))
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#711E6C",
                    }}
                  />
                  <span style={{ fontSize: "15px", fontWeight: "600" }}>
                    Movimentos Fetais Presentes
                  </span>
                </label>
                {validationErrors.movimentos_fetais_presentes && (
                  <div
                    style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {validationErrors.movimentos_fetais_presentes}
                  </div>
                )}
              </div>

              {/* Admissão */}
              <h3 style={pageStyles.userSectionTitle}>Dados da Admissão</h3>
              <hr />
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Leito*
                  </label>
                  <select
                    name="leito_id"
                    value={formData.leito_id}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "13px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Selecione um leito...</option>
                    {leitos.length > 0 ? (
                      leitos.map((leito) => (
                        <option key={leito.id} value={leito.id}>
                          {leito.nome || `Leito ${leito.id}`}
                        </option>
                      ))
                    ) : (
                      <option disabled>Carregando leitos...</option>
                    )}
                  </select>
                  {validationErrors.leito_id && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {validationErrors.leito_id}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: "2", minWidth: "400px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Motivo da Internação*
                  </label>
                  <textarea
                    name="motivo_internacao"
                    value={formData.motivo_internacao}
                    onChange={handleInputChange}
                    rows={3}
                    style={{
                      width: "98%",
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                  {validationErrors.motivo_internacao && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.motivo_internacao}
                    </div>
                  )}
                </div>
              </div>

              {/* LGPD */}
              <h3 style={pageStyles.userSectionTitle}>Consentimento LGPD</h3>
              <hr />

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="consentimento_lgpd_aceito"
                    checked={formData.consentimento_lgpd_aceito}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        consentimento_lgpd_aceito: e.target.checked,
                      }))
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      marginTop: "2px",
                      accentColor: "#711E6C",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      color: "#333",
                    }}
                  >
                    Eu concordo com o tratamento dos dados pessoais da paciente
                    de acordo com a Lei Geral de Proteção de Dados (LGPD).
                    Autorizo o uso das informações para os fins relacionados ao
                    atendimento hospitalar.*
                  </span>
                </label>
                {validationErrors.consentimento_lgpd_aceito && (
                  <div
                    style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {validationErrors.consentimento_lgpd_aceito}
                  </div>
                )}
              </div>

              {/* Botões */}
              <div style={pageStyles.buttonContainer}>
                <BrButton
                  type="button"
                  className="clear-button"
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  Limpar
                </BrButton>
                <BrButton
                  type="submit"
                  className="register-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar Admissão"}
                </BrButton>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default PacienteAdmissao;
