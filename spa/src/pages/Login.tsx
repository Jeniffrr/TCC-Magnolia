import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/Layout/AppLayout";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumbs";
import { logger, performanceMonitor } from "../utils/logger";
import "./Login.css";

type UserType =
  | "administrador"
  | "medico"
  | "enfermeiro"
  | "tecnico_enfermagem";

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: UserType;
  tipo_usuario?: UserType;
}

interface LoginResponse {
  token?: string;
  user?: User;
  two_factor_required?: boolean;
  user_id?: number;
  qr_code_url?: string;
  secret?: string;
  first_time?: boolean;
  message?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  const navigate = useNavigate();

  const BREADCRUMB_ITEMS = [
    { label: "", url: "/" },
    { label: "Login", active: true },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações iniciais
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }

    if (requires2FA && (!code || code.length !== 6)) {
      setError("Digite o código de 6 dígitos");
      return;
    }

    setIsLoading(true);

    try {
      logger.info('Tentativa de login', 'Login', { email: email.trim() });
      performanceMonitor.start('login');
      
      await api.get("/sanctum/csrf-cookie");
      
      // Se já requer 2FA, envia o código
      if (requires2FA && userId) {
        const response = await api.post<LoginResponse>("/api/two-factor-challenge", {
          user_id: userId,
          code: code.trim(),
        });
        
        performanceMonitor.end('login', 'Login');
        const { token, user } = response.data;
        
        if (!token || !user) {
          throw new Error("Resposta da API inválida");
        }
        
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        logger.info('Login com 2FA realizado com sucesso', 'Login', { userId: user.id });
        
        const userType = user.tipo_usuario || user.tipo;
        switch (userType) {
          case "administrador":
            navigate("/admin");
            break;
          default:
            navigate("/profissionais");
        }
        return;
      }
      
      // Primeiro passo: email e senha
      const response = await api.post<LoginResponse>("/api/login", {
        email: email.trim(),
        password,
      });
      
      performanceMonitor.end('login', 'Login');

      const { user_id, qr_code_url, secret, first_time } = response.data;

      // 2FA é SEMPRE obrigatório - não há login sem 2FA
      if (!user_id) {
        throw new Error("Erro no sistema de autenticação");
      }

      logger.info('2FA requerido', 'Login', { userId: user_id });
      setRequires2FA(true);
      setUserId(user_id);
      setQrCodeUrl(qr_code_url || "");
      setSecret(secret || "");
      setIsFirstTime(first_time || false);
      setError(null);
      return;
    } catch (err: unknown) {
      const error = err as ApiError;
      logger.error('Falha no login', err, 'Login');
      
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao fazer login. Tente novamente.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-3 mt-3">
        <Breadcrumb
          items={BREADCRUMB_ITEMS}
          homeIcon={true}
          className="custom-breadcrumb"
        />
      </div>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Sistema de Gestão Hospitalar</h2>
            <p>Faça login para acessar o sistema</p>
          </div>

          <div className="login-body">
            {requires2FA && isFirstTime && (
              <div className="login-2fa-setup">
                <h3>
                  <i className="fas fa-shield-alt"></i>
                  Configure seu 2FA (Primeira vez)
                </h3>
                <div className="login-2fa-steps">
                  <p>1. Instale um app autenticador (Google Authenticator, Authy, etc.)</p>
                  <p>2. Escaneie o QR Code:</p>
                  {qrCodeUrl && (
                    <div className="login-qr-container">
                      <img src={qrCodeUrl} alt="QR Code" className="login-qr-image" />
                    </div>
                  )}
                  {secret && (
                    <>
                      <p>Ou digite manualmente:</p>
                      <div className="login-secret-box">{secret}</div>
                    </>
                  )}
                  <p>3. Digite o código de 6 dígitos gerado:</p>
                </div>
              </div>
            )}

            {requires2FA && !isFirstTime && (
              <div className="login-alert login-alert-info">
                <i className="fas fa-shield-alt"></i>
                <span>Digite o código de 6 dígitos do seu aplicativo autenticador</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {error && (
                <div className="login-alert login-alert-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="login-form-group">
                <label className="login-label">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || requires2FA}
                  className="login-input"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">Senha:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || requires2FA}
                  className="login-input"
                  placeholder="••••••••"
                />
              </div>

              {requires2FA && (
                <div className="login-form-group">
                  <label className="login-label">Código 2FA:</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    required
                    disabled={isLoading}
                    autoFocus
                    className="login-input login-input-2fa"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setRequires2FA(false);
                      setUserId(null);
                      setCode("");
                      setError(null);
                    }}
                    className="login-back-button"
                  >
                    <i className="fas fa-arrow-left"></i> Voltar
                  </button>
                </div>
              )}

              <button type="submit" disabled={isLoading} className="login-submit-button">
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Entrando...
                  </>
                ) : requires2FA ? (
                  <>
                    <i className="fas fa-check-circle"></i> Verificar Código
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i> Entrar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
