import React, { useState, useEffect } from 'react';
import { Container, BrButton } from '@govbr-ds/react-components';
import AppLayout from '../components/Layout/AppLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumbs';
import { pageStyles } from '../assets/style/pageStyles';
import api from '../api/axios';

const TwoFactorSettings: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const BREADCRUMB_ITEMS = [
    { label: '', url: '/' },
    { label: 'Configurações de Segurança', active: true },
  ];

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await api.get('/api/two-factor/status');
      setIsEnabled(response.data.enabled);
    } catch (err) {
      console.error('Erro ao verificar status 2FA:', err);
    }
  };

  const handleEnable = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/api/two-factor/enable');
      setQrCodeUrl(response.data.qr_code_url);
      setSecret(response.data.secret);
      setShowSetup(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao ativar 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!code || code.length !== 6) {
      setError('Digite o código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await api.post('/api/two-factor/confirm', { code });
      setSuccess('2FA ativado com sucesso!');
      setIsEnabled(true);
      setShowSetup(false);
      setCode('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Código inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!password) {
      setError('Digite sua senha para desativar o 2FA');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await api.post('/api/two-factor/disable', { password });
      setSuccess('2FA desativado com sucesso!');
      setIsEnabled(false);
      setPassword('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Senha incorreta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <Container fluid>
        <div className="mb-3 mt-3">
          <Breadcrumb items={BREADCRUMB_ITEMS} homeIcon={true} className="custom-breadcrumb" />
        </div>

        <h1 style={pageStyles.title}>Autenticação em Duas Etapas (2FA)</h1>

        <div style={pageStyles.containerPadding}>
          {error && (
            <div className="alert-card error">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert-card success">
              <i className="fas fa-check-circle"></i>
              {success}
            </div>
          )}

          <div className="register-container">
            <div style={{ marginBottom: '24px' }}>
              <h3 style={pageStyles.sectionTitle}>Status Atual</h3>
              <hr />
              <p style={{ fontSize: '16px', marginBottom: '16px' }}>
                2FA está atualmente: <strong>{isEnabled ? 'ATIVADO' : 'DESATIVADO'}</strong>
              </p>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                A autenticação em duas etapas adiciona uma camada extra de segurança à sua conta.
              </p>
            </div>

            {!isEnabled && !showSetup && (
              <div>
                <h3 style={pageStyles.sectionTitle}>Ativar 2FA</h3>
                <hr />
                <p style={{ marginBottom: '16px' }}>
                  Para ativar o 2FA, você precisará de um aplicativo autenticador como:
                </p>
                <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
                  <li>Google Authenticator</li>
                  <li>Microsoft Authenticator</li>
                  <li>Authy</li>
                </ul>
                <BrButton onClick={handleEnable} disabled={isLoading} style={pageStyles.primaryButton}>
                  {isLoading ? 'Gerando...' : 'Ativar 2FA'}
                </BrButton>
              </div>
            )}

            {showSetup && (
              <div>
                <h3 style={pageStyles.sectionTitle}>Configurar 2FA</h3>
                <hr />
                <p style={{ marginBottom: '16px' }}>
                  1. Escaneie o QR Code abaixo com seu aplicativo autenticador:
                </p>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '250px' }} />
                </div>
                <p style={{ marginBottom: '8px' }}>
                  2. Ou digite manualmente este código:
                </p>
                <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '14px', textAlign: 'center' }}>
                  {secret}
                </div>
                <p style={{ marginBottom: '16px' }}>
                  3. Digite o código de 6 dígitos gerado pelo aplicativo:
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    style={{ width: '200px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px', textAlign: 'center', letterSpacing: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <BrButton onClick={() => setShowSetup(false)} style={pageStyles.secundaryButton}>
                    Cancelar
                  </BrButton>
                  <BrButton onClick={handleConfirm} disabled={isLoading} style={pageStyles.primaryButton}>
                    {isLoading ? 'Verificando...' : 'Confirmar'}
                  </BrButton>
                </div>
              </div>
            )}

            {isEnabled && (
              <div>
                <h3 style={pageStyles.sectionTitle}>Desativar 2FA</h3>
                <hr />
                <p style={{ marginBottom: '16px', color: '#d32f2f' }}>
                  ⚠️ Desativar o 2FA reduzirá a segurança da sua conta.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  Digite sua senha para confirmar:
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    style={{ width: '300px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
                <BrButton onClick={handleDisable} disabled={isLoading} style={{ ...pageStyles.primaryButton, backgroundColor: '#d32f2f' }}>
                  {isLoading ? 'Desativando...' : 'Desativar 2FA'}
                </BrButton>
              </div>
            )}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default TwoFactorSettings;
