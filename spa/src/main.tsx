import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Register } from './pages/Resgister/Register';
import GerenciarUsuarios from './pages/Admin/GerenciarUsuarios';
import GerenciarLeitos from './pages/Admin/GerenciarLeitos';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminHome from './pages/Admin/Home';
import ProtectedRoute from './components/ProtectedRoute';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute requiredRole="administrador"><AdminHome /></ProtectedRoute>} />
        <Route path="/admin/usuarios" element={<ProtectedRoute requiredRole="administrador"><GerenciarUsuarios /></ProtectedRoute>} />
        <Route path="/admin/leitos" element={<ProtectedRoute requiredRole="administrador"><GerenciarLeitos /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
