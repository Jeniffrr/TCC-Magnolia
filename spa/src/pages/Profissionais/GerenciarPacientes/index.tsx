import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PacienteLista } from './components/ListarPacientes';
import PacienteAdmissao from './components/PacienteAdmissao';
import PacienteEditar from './components/PacienteEditar';
import PacienteVer from './components/PacienteVer';

const GerenciarPacientes: React.FC = () => {
  const navigate = useNavigate();

  const handleVerPaciente = (internacaoId: number) => {
    navigate(`${internacaoId}/atendimentos`);
  };

  const handleEditarPaciente = (pacienteId: number) => {
    navigate(`${pacienteId}/editar`);
  };

  const handleNovaAdmissao = () => {
    navigate('novo');
  };

  return (
    <Routes>
      <Route index element={<PacienteLista onVerPaciente={handleVerPaciente} onEditarPaciente={handleEditarPaciente} onNovaAdmissao={handleNovaAdmissao} />} />
      <Route path="novo" element={<PacienteAdmissao />} />
      <Route path=":id/editar" element={<PacienteEditar />} />
      <Route path=":id/atendimentos" element={<PacienteVer />} />
    </Routes>
  );
};

export default GerenciarPacientes;