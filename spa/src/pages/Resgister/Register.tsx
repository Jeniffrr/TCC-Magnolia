import React from "react";
import {
  BrButton,
  Container,
} from "@govbr-ds/react-components";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumbs";
import BrInputIcon from "../../components/BrInputIcon/BrInputIcon";
import { useRegisterForm } from '../../hooks/Register.hooks';
import { BREADCRUMB_ITEMS, API_ENDPOINTS, INITIAL_FORM_DATA } from './components/Register.constants';
import type { ApiErrorResponse } from '../../types/Register.types';
import { handleApiErrors } from '../../utils/Register.utils';
import "./Register.css";
import AppLayout from "../../components/Layout/AppLayout";
import { pageStyles, getFieldStatus, getFeedbackText } from "../../assets/style/pageStyles";

export const Register: React.FC = () => {
  const {
    formData,
    errors,
    isSubmitting,
    showSuccess,
    setErrors,
    setShowSuccess,
    handleChange,
    handleBlur,
    handleInputMask,
    handleClear,
    validateForm,
    setIsSubmitting,
    setFormData,
  } = useRegisterForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(API_ENDPOINTS.REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            data_consentimento_lgpd: formData.consentimento_lgpd ? new Date().toISOString() : null
          }),
        });

        const responseData = await response.json() as ApiErrorResponse;

        if (response.ok) {
          setShowSuccess(true);
          setFormData(INITIAL_FORM_DATA);
          setErrors({});
        } else {
          const apiErrors = handleApiErrors(responseData);
          if (Object.keys(apiErrors).length > 0) {
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
      
      <h1 style={pageStyles.title}>Registrar-me</h1>
      
      <div style={pageStyles.containerPadding}>
        {showSuccess && (
          <div className="alert-card success">
            <i className="fas fa-check-circle"></i>
            Registro realizado com sucesso!
          </div>
        )}
        
        {errors.general && (
          <div className="alert-card error">
            <i className="fas fa-exclamation-triangle"></i>
            {errors.general}
          </div>
        )}

        <div className="register-container">
          <form onSubmit={handleSubmit} noValidate>
            {/* Dados do Hospital */}
            <h3 style={pageStyles.sectionTitle}>Dados do Hospital</h3>
            <hr  />
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '2', minWidth: '800px' }}>
                <BrInputIcon
                  label="Nome do Hospital*"
                  name="hospital_nome"
                  type="text"
                  value={formData.hospital_nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={255}
                  icon="fas fa-hospital"
                  status={getFieldStatus(errors.hospital_nome)}
                  feedbackText={getFeedbackText(errors.hospital_nome)}
                />
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <BrInputIcon
                  label="CNPJ*"
                  name="cnpj"
                  type="text"
                  value={formData.cnpj}
                  onChange={handleInputMask}
                  onBlur={handleBlur}
                  placeholder="00.000.000/0000-00"
                  icon="fas fa-building"
                  status={getFieldStatus(errors.cnpj)}
                  feedbackText={getFeedbackText(errors.cnpj)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '300px' }}>
                <BrInputIcon
                  label="CNES*"
                  name="cnes"
                  type="text"
                  value={formData.cnes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon="fas fa-id-card"
                  status={getFieldStatus(errors.cnes)}
                  feedbackText={getFeedbackText(errors.cnes)}
                />
              </div>
              <div style={{ flex: '1', minWidth: '700px' }}>
                <BrInputIcon
                  label="Endereço do Hospital*"
                  name="hospital_endereco"
                  type="text"
                  value={formData.hospital_endereco}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon="fas fa-map-marker-alt"
                  status={getFieldStatus(errors.hospital_endereco)}
                  feedbackText={getFeedbackText(errors.hospital_endereco)}
                />
              </div>
            </div>

            {/* Dados do Usuário */}
            <h3 style={pageStyles.userSectionTitle}>Dados do Usuário</h3>
            <hr  />
            
              <div style={{ flex: '1', minWidth: '1000px' }}>
                <BrInputIcon
                  label="Nome Completo*"
                  name="usuario_nome"
                  type="text"
                  value={formData.usuario_nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={255}
                  icon="fas fa-user"
                  status={getFieldStatus(errors.usuario_nome)}
                  feedbackText={getFeedbackText(errors.usuario_nome)}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '800px' }}>
                <BrInputIcon
                  label="E-mail*"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon="fas fa-envelope"
                  status={getFieldStatus(errors.email)}
                  feedbackText={getFeedbackText(errors.email)}
                />
              </div>

            
              <div style={{ flex: '1', minWidth: '200px' }}>
                <BrInputIcon
                  label="CPF*"
                  name="usuario_cpf"
                  type="text"
                  value={formData.usuario_cpf}
                  onChange={handleInputMask}
                  onBlur={handleBlur}
                  placeholder="000.000.000-00"
                  icon="fas fa-id-badge"
                  status={getFieldStatus(errors.usuario_cpf)}
                  feedbackText={getFeedbackText(errors.usuario_cpf)}
                />
              </div>
               </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '300px' }}>
                <div style={{ marginBottom: '6px', fontSize: '12px', color: '#666' }}>
                  A senha deve ter pelo menos 8 caracteres
                </div>
                <BrInputIcon
                  label="Senha*"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon="fas fa-lock"
                  status={getFieldStatus(errors.senha)}
                  feedbackText={getFeedbackText(errors.senha)}
                />
              </div>
           
              <div style={{ flex: '1', minWidth: '300px', maxWidth: '50%' , marginTop: '20px' }}>
                <BrInputIcon
                  label="Confirmar Senha*"
                  name="senha_confirmation"
                  type="password"
                  value={formData.senha_confirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon="fas fa-lock"
                  status={getFieldStatus(errors.senha_confirmation)}
                  feedbackText={getFeedbackText(errors.senha_confirmation)}
                />
              </div>
            </div>
            
            {/* LGPD */}
            <h3 style={pageStyles.userSectionTitle}>Consentimento LGPD</h3>
            <hr  />
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="consentimento_lgpd"
                  checked={formData.consentimento_lgpd || false}
                  onChange={handleChange}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '2px',
                    accentColor: '#711E6C'
                  }}
                />
                <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#333' }}>
                  Eu concordo com o tratamento dos meus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD). 
                  Autorizo o uso das minhas informações para os fins relacionados ao funcionamento do sistema hospitalar.*
                </span>
              </label>
              {errors.consentimento_lgpd && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.consentimento_lgpd}
                </div>
              )}
            </div>

            {/* Botões */}
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
     </AppLayout>
  );
};
export default Register;