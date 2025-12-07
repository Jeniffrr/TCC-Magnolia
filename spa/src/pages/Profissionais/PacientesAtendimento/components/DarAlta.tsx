import React, { useState } from 'react';
import { BrButton } from '@govbr-ds/react-components';
import { pageStyles } from '../../../../assets/style/pageStyles';
import api from '../../../../api/axios';
import '../style.css';

interface DarAltaProps {
  internacaoId: number;
  pacienteNome: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DarAlta: React.FC<DarAltaProps> = ({ internacaoId, pacienteNome, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    resumo_alta: '',
    recomendacoes_pos_alta: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!internacaoId) {
      setError('ID da internação não encontrado');
      setLoading(false);
      return;
    }

    if (!formData.resumo_alta?.trim() || !formData.recomendacoes_pos_alta?.trim()) {
      setError('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      await api.post(`/api/internacoes/${internacaoId}/alta`, formData);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 404) {
        setError('Internação não encontrada');
      } else if (error.response?.status === 422) {
        setError(error.response?.data?.message || 'Dados inválidos. Verifique os campos');
      } else if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente');
      } else {
        setError(error.response?.data?.message || 'Erro ao processar alta. Tente novamente');
      }
      console.error('Erro ao dar alta:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content dar-alta-modal">
        <div className="modal-header dar-alta-header">
          <h2>
            <i className="fas fa-sign-out-alt dar-alta-icon"></i>
            Dar Alta - {pacienteNome}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="dar-alta-error">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dar-alta-form">
          <div className="dar-alta-field">
            <label className="dar-alta-label">
              Resumo da Alta*:
            </label>
            <textarea 
              value={formData.resumo_alta}
              onChange={(e) => setFormData({...formData, resumo_alta: e.target.value})}
              rows={4}
              placeholder="Resumo do atendimento, procedimentos realizados, evolução clínica..."
              className="dar-alta-textarea"
              required
            />
          </div>

          <div className="dar-alta-field">
            <label className="dar-alta-label">
              Recomendações Pós-Alta*:
            </label>
            <textarea 
              value={formData.recomendacoes_pos_alta}
              onChange={(e) => setFormData({...formData, recomendacoes_pos_alta: e.target.value})}
              rows={4}
              placeholder="Orientações para cuidados domiciliares, medicamentos, retorno..."
              className="dar-alta-textarea"
              required
            />
          </div>

          <div className="dar-alta-actions">
            <BrButton
              type="button"
              onClick={onClose}
              style={pageStyles.secundaryButton}
            >
              Cancelar
            </BrButton>
            <BrButton
              type="submit"
              disabled={loading}
              style={pageStyles.primaryButton}
            >
              {loading ? 'Processando...' : 'Confirmar Alta'}
            </BrButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DarAlta;