import React, { useState } from 'react';
import { BrButton } from '@govbr-ds/react-components';
import { pageStyles } from '../../../../assets/style/pageStyles';
import api from '../../../../api/axios';

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

    try {
      await api.post(`/api/internacoes/${internacaoId}/alta`, formData);
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao processar alta';
      setError(errorMessage);
      console.error('Erro ao dar alta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        <div className="modal-header" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            <i className="fas fa-sign-out-alt" style={{ marginRight: '8px', color: '#711E6C' }}></i>
            Dar Alta - {pacienteNome}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div style={{ margin: '20px', padding: '12px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b' }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
              Resumo da Alta:
            </label>
            <textarea 
              value={formData.resumo_alta}
              onChange={(e) => setFormData({...formData, resumo_alta: e.target.value})}
              rows={4}
              placeholder="Resumo do atendimento, procedimentos realizados, evolução clínica..."
              style={{ width: '95%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
              Recomendações Pós-Alta:
            </label>
            <textarea 
              value={formData.recomendacoes_pos_alta}
              onChange={(e) => setFormData({...formData, recomendacoes_pos_alta: e.target.value})}
              rows={4}
              placeholder="Orientações para cuidados domiciliares, medicamentos, retorno..."
              style={{ width: '95%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
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