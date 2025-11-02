import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/Layout/AppLayout";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumbs";

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
  token: string;
  user: User;
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    setIsLoading(true);

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post<LoginResponse>("/api/login", {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      // Validação da resposta
      if (!token || !user) {
        throw new Error("Resposta da API inválida");
      }

      // Armazenamento seguro
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirecionamento
      const userType = user.tipo_usuario || user.tipo;
      switch (userType) {
        case "administrador":
          navigate("/admin");
          break;
        case "medico":
          navigate("/profissionais");
          break;
        case "enfermeiro":
          navigate("/profissionais");
          break;
        case "tecnico_enfermagem":
          navigate("/profissionais");
          break;
        default:
          navigate("/");
      }
    } catch (err: unknown) {
      const error = err as ApiError;
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
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          {error && (
            <div
              style={{
                color: "red",
                border: "1px solid red",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "4px",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Senha:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isLoading ? "#999" : "#864381",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Login;
