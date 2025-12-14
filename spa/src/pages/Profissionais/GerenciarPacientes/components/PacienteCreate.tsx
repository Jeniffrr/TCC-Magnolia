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
import { applyCpfMask, applyPhoneMask, applyCepMask, validateCpf } from "../../../../utils/masks";
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
          api.get("/api/leitos/disponiveis"),
          api.get("/api/condicoes-patologicas")
        ]);
        setLeitos(leitosRes.data || []);
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
      // Remove erro de CPF ao digitar
      if (validationErrors.cpf) {
        const { cpf, ...rest } = validationErrors;
        setValidationErrors(rest);
      }
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
      altura_uterina: Number(formData.altura_uterina) || null
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
                    status={getFieldStatus(validationErrors.cpf)}
                    feedbackText={getFeedbackText(validationErrors.cpf)}
                  />
                </div>
              </div>

              <div className="admissao-flex-row">
                <div className="admissao-field-xlarge">
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

              {/* Endereço */}
              <h3 style={pageStyles.userSectionTitle}>Endereço</h3>
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

              {/* Histórico Médico */}
              <h3 style={pageStyles.userSectionTitle}>Histórico Médico</h3>
              <hr />

              <div className="admissao-flex-row-margin">
                <div className="admissao-field-xlarge">
                  <label className="admissao-form-label">
                    Alergias
                  </label>
                  <textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleInputChange}
                    rows={4}
                    className="admissao-form-container"
                  />
                  {validationErrors.alergias && (
                    <div className="admissao-error-text">
                      {validationErrors.alergias}
                    </div>
                  )}
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
                  {validationErrors.medicamentos_continuos && (
                    <div className="admissao-error-text">
                      {validationErrors.medicamentos_continuos}
                    </div>
                  )}
                </div>
              </div>

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

              {/* Gestações Anteriores */}
              <h3 style={pageStyles.userSectionTitle}>Gestações Anteriores</h3>
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
                            updateGestacao(index, "tipo_parto", e.target.value)
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
                   
                      <div className="admissao-gestacao-field-large" style={{ marginTop:"16px"}}>
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

              {/* Sinais Vitais */}
              <h3 style={pageStyles.userSectionTitle}>Sinais Vitais</h3>
              <hr />

              <div className="admissao-flex-row">
                <div className="admissao-field-relative">
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
                  <span className="admissao-unit-label">
                    mmHg
                  </span>
                </div>
                <div className="admissao-field-relative">
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
                  <span className="admissao-unit-label">
                    mmHg
                  </span>
                </div>
                <div className="admissao-field-relative">
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
                  <span className="admissao-unit-label">
                    bpm
                  </span>
                </div>
              </div>

              <div className="admissao-flex-row">
                <div className="admissao-field-relative" style={{ minWidth: "200px" }}>
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
                  <span className="admissao-unit-label">
                    °C
                  </span>
                </div>
                <div className="admissao-field-relative">
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
                  <span className="admissao-unit-label">
                    rpm
                  </span>
                </div>
              </div>

              {/* Avaliação Obstétrica */}
              <h3 style={pageStyles.userSectionTitle}>Avaliação Obstétrica</h3>
              <hr />
              <div className="admissao-flex-row-margin">
                <div className="admissao-field-relative">
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
                  <span className="admissao-unit-label">
                    bpm
                  </span>
                </div>
                <div className="admissao-field-relative">
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
                  <span className="admissao-unit-label">
                    cm
                  </span>
                </div>
              </div>

              <div className="admissao-flex-row-margin">
                <div className="admissao-field-xlarge">
                  <label className="admissao-form-label">
                    Evolução Maternidade
                  </label>
                  <textarea
                    name="evolucao_maternidade"
                    value={formData.evolucao_maternidade}
                    onChange={handleInputChange}
                    rows={4}
                    className="admissao-form-container"
                  />
                  {validationErrors.evolucao_maternidade && (
                    <div className="admissao-error-text">
                      {validationErrors.evolucao_maternidade}
                    </div>
                  )}
                </div>
              </div>
              <div className="admissao-flex-row-margin">
                <div className="admissao-field-xlarge">
                  <label className="admissao-form-label">
                    Avaliação Fetal
                  </label>
                  <textarea
                    name="avaliacao_fetal"
                    value={formData.avaliacao_fetal}
                    onChange={handleInputChange}
                    rows={4}
                    className="admissao-form-container"
                  />
                  {validationErrors.avaliacao_fetal && (
                    <div className="admissao-error-text">
                      {validationErrors.avaliacao_fetal}
                    </div>
                  )}
                </div>
              </div>

              <div className="admissao-movimentos-container">
                <label className="admissao-checkbox-label-large">
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
                    className="admissao-checkbox-large"
                  />
                  <span className="admissao-movimentos-label">
                    Movimentos Fetais Presentes
                  </span>
                </label>
                {validationErrors.movimentos_fetais_presentes && (
                  <div className="admissao-error-text">
                    {validationErrors.movimentos_fetais_presentes}
                  </div>
                )}
              </div>

              {/* Admissão */}
              <h3 style={pageStyles.userSectionTitle}>Dados da Admissão</h3>
              <hr />
              <div className="admissao-flex-row-margin">
                <div className="admissao-field-large">
                  <label className="admissao-form-label">
                    Leito*
                  </label>
                  <select
                    name="leito_id"
                    value={formData.leito_id}
                    onChange={handleInputChange}
                    className="admissao-form-select"
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
                    <div className="admissao-error-text">
                      {validationErrors.leito_id}
                    </div>
                  )}
                </div>
              </div>

              <div className="admissao-flex-row">
                <div className="admissao-field-xxlarge">
                  <label className="admissao-form-label">
                    Motivo da Internação*
                  </label>
                  <textarea
                    name="motivo_internacao"
                    value={formData.motivo_internacao}
                    onChange={handleInputChange}
                    rows={3}
                    className="admissao-form-container"
                  />
                  {validationErrors.motivo_internacao && (
                    <div className="admissao-error-text">
                      {validationErrors.motivo_internacao}
                    </div>
                  )}
                </div>
              </div>

              {/* LGPD */}
              <h3 style={pageStyles.userSectionTitle}>Consentimento LGPD</h3>
              <hr />

              <div style={{ marginBottom: "24px" }}>
                <label className="admissao-lgpd-label">
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
                    className="admissao-lgpd-checkbox"
                  />
                  <span className="admissao-lgpd-text">
                    Eu concordo com o tratamento dos dados pessoais da paciente
                    de acordo com a Lei Geral de Proteção de Dados (LGPD).
                    Autorizo o uso das informações para os fins relacionados ao
                    atendimento hospitalar.*
                  </span>
                </label>
                {validationErrors.consentimento_lgpd_aceito && (
                  <div className="admissao-error-text">
                    {validationErrors.consentimento_lgpd_aceito}
                  </div>
                )}
              </div>

              {/* Botões */}
              <div style={pageStyles.buttonContainer}>
                <BrButton
                  type="button"
                  style={pageStyles.secundaryButton}
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
