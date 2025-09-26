import React, { useState, useCallback } from "react";
import {
  BrDivider,
  BrInput,
  BrButton,
  BrMessage,
  Container,
  Col,
  Row,
} from "@govbr-ds/react-components";
import Breadcrumb from "../../components/BreadCrumbs/BrBreadcrumbs";
import BrHeader from "../../components/Header/BrHeader";
import BrInputIcon from "../../components/BrInputIcon/BrInputIcon";
import logo from "../../assets/images/Logo.png";
import "./Register.css";

// Interfaces melhoradas
interface FormData {
  hospital_nome: string;
  cnpj: string;
  hospital_endereco: string;
  cnes: string;
  usuario_nome: string;
  email: string;
  usuario_cpf: string;
  senha: string;
  senha_confirmation: string;
}

interface Errors {
  [key: string]: string | undefined;
}

interface ApiErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
}

// Constantes para reutilização
const INITIAL_FORM_DATA: FormData = {
  hospital_nome: "",
  cnpj: "",
  hospital_endereco: "",
  cnes: "",
  usuario_nome: "",
  email: "",
  usuario_cpf: "",
  senha: "",
  senha_confirmation: "",
};

const BREADCRUMB_ITEMS = [
  { label: "", url: "/", onClick: () => console.log("Navegar para home") },
  { label: "Cadastrar", active: true, onClick: () => console.log("Página atual") },
];

// Validações extraídas para melhor organização
const validationRules = {
  hospital_nome: (value: string) => {
    if (!value) return "Nome do hospital é obrigatório";
    if (value.length > 255) return "Nome deve ter no máximo 255 caracteres";
    return "";
  },
  
  cnpj: (value: string) => {
    if (!value) return "CNPJ é obrigatório";
    if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value))
      return "CNPJ deve estar no formato 00.000.000/0000-00";
    return "";
  },
  
  hospital_endereco: (value: string) => {
    if (!value) return "Endereço do hospital é obrigatório";
    return "";
  },
  
  cnes: (value: string) => {
    if (!value) return "CNES é obrigatório";
    return "";
  },
  
  usuario_nome: (value: string) => {
    if (!value) return "Nome do usuário é obrigatório";
    if (value.length > 255) return "Nome deve ter no máximo 255 caracteres";
    return "";
  },
  
  email: (value: string) => {
    if (!value) return "Email é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido";
    return "";
  },
  
  usuario_cpf: (value: string) => {
    if (!value) return "CPF é obrigatório";
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value))
      return "CPF deve estar no formato 000.000.000-00";
    return "";
  },
  
  senha: (value: string) => {
    if (!value) return "Senha é obrigatória";
    if (value.length < 8) return "Senha deve ter pelo menos 8 caracteres";
    return "";
  },
  
  senha_confirmation: (value: string, formData: FormData) => {
    if (!value) return "Confirmação de senha é obrigatória";
    if (value !== formData.senha) return "As senhas não coincidem";
    return "";
  },
};

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // useCallback para otimização de performance
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  }, []);

  const validateField = useCallback((name: string, value: string): string => {
    const rule = validationRules[name as keyof typeof validationRules];
    if (!rule) return "";
    
    return rule(value, formData);
  }, [formData]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField]);

  // Funções de máscara otimizadas
  const applyCnpjMask = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, "").substring(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }, []);

  const applyCpfMask = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, "").substring(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  }, []);

  const handleInputMask = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "cnpj") {
      newValue = applyCnpjMask(value);
    } else if (name === "usuario_cpf") {
      newValue = applyCpfMask(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Limpar erro do campo
    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  }, [applyCnpjMask, applyCpfMask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar todos os campos
    const newErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // 
        const dataToSend = { ...formData };
        
        const response = await fetch('http://localhost:8000/api/primeiro-acesso/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        const responseData = await response.json() as ApiErrorResponse;

        if (response.ok) {
          setShowSuccess(true);
          setFormData(INITIAL_FORM_DATA);
          setErrors({});
        } else {
          if (responseData.errors) {
            // Converter erros do Laravel (array) para nosso formato
            const apiErrors: Errors = {};
            Object.entries(responseData.errors).forEach(([key, messages]) => {
              apiErrors[key] = messages[0];
            });
            setErrors(apiErrors);
          } else {
            setErrors({ 
              general: responseData.message || 'Erro ao realizar cadastro. Tente novamente.' 
            });
          }
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        setErrors({ general: 'Erro de conexão. Verifique sua internet.' });
      }
    }

    setIsSubmitting(false);
  };

  const handleClear = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setShowSuccess(false);
  }, []);

  // Estilos inline extraídos para constantes
  const pageStyles = {
    title: { marginLeft: '70px', marginBottom: '25px', fontSize: '60px' },
    sectionTitle: { marginBottom: '20px', color: '#333' },
    userSectionTitle: { marginTop: '30px', marginBottom: '20px', color: '#333' },
    buttonContainer: { marginTop: '30px', display: 'flex', gap: '16px', justifyContent: 'center' },
    containerPadding: { padding: '0 40px' }
  };

  return (
    <Container>
      <BrHeader logoUrl={logo} />
      <div className="mb-3 mt-3">
        <Breadcrumb
          items={BREADCRUMB_ITEMS}
          homeIcon={true}
          className="custom-breadcrumb"
        />
      </div>
      
      <h1 style={pageStyles.title}>Cadastrar</h1>
      
      <div style={pageStyles.containerPadding}>
        {showSuccess && (
          <BrMessage
            status="success"
            className="mb-3"
            message="Registro realizado com sucesso! Aguarde a aprovação do administrador."
          />
        )}
        
        {errors.general && (
          <BrMessage
            status="danger"
            className="mb-3"
            message={errors.general}
          />
        )}

        <div className="register-container">
          <form onSubmit={handleSubmit} noValidate>
            <h3 style={pageStyles.sectionTitle}>Dados do Hospital</h3>
            <BrDivider />
            
            <Row>
              <Col xs={12} md={6}>
                <BrInputIcon
                  label="Nome do Hospital*"
                  name="hospital_nome"
                  type="text"
                  value={formData.hospital_nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={255}
                  icon="fas fa-hospital"
                  status={errors.hospital_nome ? "danger" : undefined}
                  feedbackText={errors.hospital_nome}
                />
              </Col>
              <Col xs={12} md={6}>
                <BrInput
                  label="CNPJ*"
                  name="cnpj"
                  type="text"
                  value={formData.cnpj}
                  onChange={handleInputMask}
                  onBlur={handleBlur}
                  placeholder="00.000.000/0000-00"
                  status={errors.cnpj ? "danger" : undefined}
                  feedbackText={errors.cnpj}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <BrInput
                  label="CNES*"
                  name="cnes"
                  type="text"
                  value={formData.cnes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={errors.cnes ? "danger" : undefined}
                  feedbackText={errors.cnes}
                />
              </Col>
              <Col xs={12} md={6}>
                <BrInput
                  label="Endereço do Hospital*"
                  name="hospital_endereco"
                  type="text"
                  value={formData.hospital_endereco}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={errors.hospital_endereco ? "danger" : undefined}
                  feedbackText={errors.hospital_endereco}
                />
              </Col>
            </Row>

            <h3 style={pageStyles.userSectionTitle}>Dados do Usuário</h3>
            <BrDivider />
            
            <Row>
              <Col xs={12} md={6}>
                <BrInputIcon
                  label="Nome Completo*"
                  name="usuario_nome"
                  type="text"
                  value={formData.usuario_nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={255}
                  icon="fas fa-user"
                  status={errors.usuario_nome ? "danger" : undefined}
                  feedbackText={errors.usuario_nome}
                />
              </Col>
              <Col xs={12} md={6}>
                <BrInputIcon
                  label="E-mail*"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon="fas fa-envelope"
                  status={errors.email ? "danger" : undefined}
                  feedbackText={errors.email}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <BrInput
                  label="CPF*"
                  name="usuario_cpf"
                  type="text"
                  value={formData.usuario_cpf}
                  onChange={handleInputMask}
                  onBlur={handleBlur}
                  placeholder="000.000.000-00"
                  status={errors.usuario_cpf ? "danger" : undefined}
                  feedbackText={errors.usuario_cpf}
                />
              </Col>
              <Col xs={12} md={6}>
                <BrInput
                  label="Senha*"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={errors.senha ? "danger" : undefined}
                  feedbackText={errors.senha || "A senha deve ter pelo menos 8 caracteres"}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <BrInput
                  label="Confirmar Senha*"
                  name="senha_confirmation"
                  type="password"
                  value={formData.senha_confirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={errors.senha_confirmation ? "danger" : undefined}
                  feedbackText={errors.senha_confirmation}
                />
              </Col>
            </Row>

            <div style={pageStyles.buttonContainer}>
              <BrButton 
                type="button" 
                className="clear-button" 
                onClick={handleClear}
                disabled={isSubmitting}
              >
                Limpar
              </BrButton>
              <BrButton 
                type="submit" 
                className="register-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registrando..." : "Cadastrar"}
              </BrButton>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Register;