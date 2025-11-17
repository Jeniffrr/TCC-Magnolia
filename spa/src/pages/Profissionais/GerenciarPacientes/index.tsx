import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PacienteLista } from './components/PacienteList';
import PacienteAdmissao from './components/PacienteCreate';
import PacienteEditar from './components/PacienteUpdate';
import PacienteVer from './components/PacienteView';

const GerenciarPacientes: React.FC = () => {
  const navigate = useNavigate();

  const handleVerPaciente = (pacienteId: number) => {
    navigate(`${pacienteId}/visualizar`);
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
      <Route path=":id/visualizar" element={<PacienteVer />} />
    </Routes>
  );
};

export default GerenciarPacientes;