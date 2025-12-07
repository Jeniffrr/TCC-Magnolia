import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import TwoFactorSettings from "../pages/TwoFactorSettings";
import { Register } from "../pages/Resgister/Register";
import ProfissionaisHome from "../pages/Profissionais/Home";
import AdminHome from "../pages/Admin/Home";
import GerenciarUsuarios from "../pages/Admin/GerenciarUsuarios";
import GerenciarLeitos from "../pages/Admin/GerenciarLeitos";
import GerenciarPacientes from "../pages/Profissionais/GerenciarPacientes";
import NovoAtendimento from "../pages/Profissionais/PacientesAtendimento/components/NovoAtendimento";
import HistoricoCompleto from "../pages/Profissionais/PacientesAtendimento/HistoricoCompleto";
import Home from "../pages/Home";
import Privacidade from "../pages/Privacidade";
import Termos from "../pages/Termos";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  adminOnly?: boolean;
}> = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("auth_token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userType = user?.tipo_usuario || user?.tipo;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admins só podem acessar rotas de admin
  if (adminOnly && userType !== "administrador") {
    return <Navigate to="/profissionais" replace />;
  }

  // Não-admins só podem acessar rotas de profissionais
  if (!adminOnly && userType === "administrador") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />

        {/* Rotas para profissionais (não admin) */}
        <Route
          path="/profissionais"
          element={
            <ProtectedRoute>
              <ProfissionaisHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profissionais/pacientes/*"
          element={
            <ProtectedRoute>
              <GerenciarPacientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profissionais/pacientes-atendimento/novo-atendimento/:pacienteId"
          element={
            <ProtectedRoute>
              <NovoAtendimento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profissionais/pacientes-atendimento/historico/:id"
          element={
            <ProtectedRoute>
              <HistoricoCompleto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profissionais/seguranca"
          element={
            <ProtectedRoute>
              <TwoFactorSettings />
            </ProtectedRoute>
          }
        />

        {/* Rotas para admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute adminOnly>
              <GerenciarUsuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leitos"
          element={
            <ProtectedRoute adminOnly>
              <GerenciarLeitos />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Home />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
      </Routes>
    </Router>
  );
};
