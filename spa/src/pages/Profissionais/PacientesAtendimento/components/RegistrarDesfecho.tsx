import React, { useState } from 'react';
import api from '../../../../api/axios';
import { AxiosError } from 'axios';
import { BrButton } from '@govbr-ds/react-components';
import { pageStyles } from '../../../../assets/style/pageStyles';
import '../../../../components/Modal/Modal.css';

interface RegistrarDesfechoProps {
  internacaoId: number;
  pacienteNome: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TIPOS_DESFECHO = [
  'Parto',
  'Abortamento Completo',
  'Abortamento Incompleto / Retido',
  'Abortamento Terapêutico',
  'Natimorto',
  'Gravidez ectópica'
] as const;

const TIPOS_PARTO = ['Normal', 'Cesariana', 'Fórceps', 'Vácuo'] as const;

const SEXOS = ['Masculino', 'Feminino', 'Indeterminado'] as const;

const RegistrarDesfecho: React.FC<RegistrarDesfechoProps> = ({ internacaoId, pacienteNome, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    data_hora_evento: new Date().toISOString().slice(0, 16),
    semana_gestacional: '',
    tipo_parto: '',
    observacoes: '',
    recem_nascidos: [{
      sexo: '',
      peso: '',
      altura: '',
      apgar_1_min: '',
      apgar_5_min: '',
      observacoes_iniciais: ''
    }]
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
      const payload = formData.tipo === 'Parto' ? formData : {
        tipo: formData.tipo,
        data_hora_evento: formData.data_hora_evento,
        semana_gestacional: formData.semana_gestacional,
        observacoes: formData.observacoes
      };
      await api.post(`/api/internacoes/${internacaoId}/desfecho`, payload);
      onSuccess();
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Erro ao registrar desfecho';
      setError(errorMessage);
      console.error('Erro ao registrar desfecho:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '800px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Registrar Desfecho Clínico - {pacienteNome}</h3>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '4px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Tipo de Desfecho:</label>
              <select 
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                required
              >
                <option value="">Selecione o tipo</option>
                {TIPOS_DESFECHO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Data e Hora do Evento:</label>
                <input 
                  type="datetime-local"
                  value={formData.data_hora_evento}
                  onChange={(e) => setFormData({...formData, data_hora_evento: e.target.value})}
                  style={{ width: '90%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Semana Gestacional:</label>
                <input 
                  type="number"
                  min="4"
                  max="45"
                  value={formData.semana_gestacional}
                  onChange={(e) => setFormData({...formData, semana_gestacional: e.target.value})}
                  style={{ width: '90%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                  required
                />
              </div>
            </div>

            {formData.tipo === 'Parto' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Tipo de Parto:</label>
                  <select 
                    value={formData.tipo_parto}
                    onChange={(e) => setFormData({...formData, tipo_parto: e.target.value})}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    {TIPOS_PARTO.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Dados do Recém-Nascido</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Sexo:</label>
                      <select 
                        value={formData.recem_nascidos[0].sexo}
                        onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], sexo: e.target.value}]})}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                        required
                      >
                        <option value="">Selecione</option>
                        {SEXOS.map(sexo => (
                          <option key={sexo} value={sexo}>{sexo}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Peso (kg):</label>
                        <input 
                          type="number"
                          step="0.01"
                          min="0.1"
                          value={formData.recem_nascidos[0].peso}
                          onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], peso: e.target.value}]})}
                          style={{ width: '90%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Altura (cm):</label>
                        <input 
                          type="number"
                          min="20"
                          value={formData.recem_nascidos[0].altura}
                          onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], altura: e.target.value}]})}
                          style={{ width: '90%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>APGAR 1 min:</label>
                        <input 
                          type="number"
                          min="0"
                          max="10"
                          value={formData.recem_nascidos[0].apgar_1_min}
                          onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], apgar_1_min: e.target.value}]})}
                          style={{ width: '90%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>APGAR 5 min:</label>
                        <input 
                          type="number"
                          min="0"
                          max="10"
                          value={formData.recem_nascidos[0].apgar_5_min}
                          onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], apgar_5_min: e.target.value}]})}
                          style={{ width: '90%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Observações Iniciais do RN:</label>
                      <textarea 
                        value={formData.recem_nascidos[0].observacoes_iniciais}
                        onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], observacoes_iniciais: e.target.value}]})}
                        rows={2}
                        style={{ width: '95%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                        placeholder="Observações sobre o recém-nascido..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Observações:</label>
              <textarea 
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                rows={3}
                style={{ width: '95%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                placeholder="Observações sobre o desfecho..."
              />
            </div>

            <div className="modal-footer" style={{ margin: '0 -24px -20px', padding: '16px 24px 20px', borderTop: '1px solid #e2e8f0' }}>
              <BrButton onClick={onClose} style={pageStyles.secundaryButton} type="button">
                Cancelar
              </BrButton>
              <BrButton style={pageStyles.primaryButton} disabled={loading} type="submit">
                {loading ? 'Registrando...' : 'Registrar Desfecho'}
              </BrButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarDesfecho;