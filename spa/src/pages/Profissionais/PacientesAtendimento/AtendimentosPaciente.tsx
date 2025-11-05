import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import '../style.css';

interface Paciente {
  id: number;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
}

interface Atendimento {
  id: number;
  data_atendimento: string;
  pressao_sistolica: number;
  pressao_diastolica: number;
  frequencia_cardiaca: number;
  temperatura: number;
  evolucao_maternidade: string;
  avaliacao_fetal: string;
  usuario: {
    nome: string;
  };
}

const AtendimentosPaciente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [pacienteRes, atendimentosRes] = await Promise.all([
          axios.get(`/api/pacientes/${id}`),
          axios.get(`/api/pacientes/${id}/atendimentos`)
        ]);
        
        setPaciente(pacienteRes.data);
        setAtendimentos(atendimentosRes.data);
      } catch {
        setError('Erro ao carregar dados do paciente e atendimentos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <div className="p-8">Carregando atendimentos...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!paciente) return <div className="p-8">Paciente não encontrada</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Atendimentos da Paciente</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="font-medium text-gray-600">Nome:</span>
            <p className="text-gray-900">{paciente.nome_completo}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">CPF:</span>
            <p className="text-gray-900">{paciente.cpf}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Data de Nascimento:</span>
            <p className="text-gray-900">{new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Histórico de Atendimentos</h2>
        </div>
        
        {atendimentos.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum atendimento registrado para esta paciente.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {atendimentos.map((atendimento) => (
              <div key={atendimento.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Atendimento #{atendimento.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(atendimento.data_atendimento).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Profissional: {atendimento.usuario.nome}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Pressão Arterial</span>
                    <p className="text-lg font-semibold text-blue-900">
                      {atendimento.pressao_sistolica}/{atendimento.pressao_diastolica} mmHg
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Frequência Cardíaca</span>
                    <p className="text-lg font-semibold text-green-900">
                      {atendimento.frequencia_cardiaca} bpm
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-yellow-800">Temperatura</span>
                    <p className="text-lg font-semibold text-yellow-900">
                      {atendimento.temperatura}°C
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Evolução Maternidade:</span>
                    <p className="text-gray-900 mt-1">{atendimento.evolucao_maternidade}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Avaliação Fetal:</span>
                    <p className="text-gray-900 mt-1">{atendimento.avaliacao_fetal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AtendimentosPaciente;