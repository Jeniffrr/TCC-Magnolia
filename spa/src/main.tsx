import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Register } from './pages/Resgister/Register';
import GerenciarUsuarios from './pages/Admin/GerenciarUsuarios';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/admin/usuarios" element={<GerenciarUsuarios />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
