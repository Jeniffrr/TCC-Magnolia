import React, { useState } from 'react';
import api from '../../../../api/axios';
import { AxiosError } from 'axios';
import { BrButton } from '@govbr-ds/react-components';
import { pageStyles } from '../../../../assets/style/pageStyles';
import '../../../../components/Modal/Modal.css';
import '../style.css';

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
      nome_provisorio: '',
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

    if (!formData.tipo || !formData.semana_gestacional) {
      setError('Tipo de desfecho e semana gestacional são obrigatórios');
      setLoading(false);
      return;
    }

    if (formData.tipo === 'Parto') {
      const rn = formData.recem_nascidos[0];
      if (!formData.tipo_parto || !rn.sexo || !rn.peso || !rn.altura || !rn.apgar_1_min || !rn.apgar_5_min) {
        setError('Todos os campos do parto e recém-nascido são obrigatórios');
        setLoading(false);
        return;
      }
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
      if (axiosError.response?.status === 404) {
        setError('Internação não encontrada');
      } else if (axiosError.response?.status === 422) {
        setError(axiosError.response?.data?.message || 'Dados inválidos. Verifique os campos obrigatórios');
      } else if (axiosError.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente');
      } else {
        setError(axiosError.response?.data?.message || 'Erro ao registrar desfecho. Tente novamente');
      }
      console.error('Erro ao registrar desfecho:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container desfecho-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Registrar Desfecho Clínico - {pacienteNome}</h3>
        </div>

        <div className="modal-body desfecho-body">
          {error && (
            <div className="desfecho-error">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="desfecho-form">
            <div className="desfecho-field">
              <label>Tipo de Desfecho:</label>
              <select 
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                required
              >
                <option value="">Selecione o tipo</option>
                {TIPOS_DESFECHO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div className="desfecho-grid-2">
              <div className="desfecho-field">
                <label>Data e Hora do Evento:</label>
                <input 
                  type="datetime-local"
                  value={formData.data_hora_evento}
                  onChange={(e) => setFormData({...formData, data_hora_evento: e.target.value})}
                  required
                />
              </div>

              <div className="desfecho-field">
                <label>Semana Gestacional:</label>
                <input 
                  type="number"
                  min="4"
                  max="45"
                  value={formData.semana_gestacional}
                  onChange={(e) => setFormData({...formData, semana_gestacional: e.target.value})}
                  required
                />
              </div>
            </div>

            {formData.tipo === 'Parto' && (
              <>
                <div className="desfecho-field">
                  <label>Tipo de Parto:</label>
                  <select 
                    value={formData.tipo_parto}
                    onChange={(e) => setFormData({...formData, tipo_parto: e.target.value})}
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    {TIPOS_PARTO.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="desfecho-section">
                  <h4>Dados do Recém-Nascido</h4>
                  
                  <div className="desfecho-rn-fields">
                    <div className="desfecho-field">
                      <label>Nome Provisório:</label>
                      <input 
                        type="text"
                        value={formData.recem_nascidos[0].nome_provisorio}
                        onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], nome_provisorio: e.target.value}]})}
                        placeholder="Ex: RN de Maria Silva"
                      />
                    </div>

                    <div className="desfecho-field">
                      <label>Sexo:</label>
                      <select 
                        value={formData.recem_nascidos[0].sexo}
                        onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], sexo: e.target.value}]})}
                        required
                      >
                        <option value="">Selecione</option>
                        {SEXOS.map(sexo => (
                          <option key={sexo} value={sexo}>{sexo}</option>
                        ))}
                      </select>
                    </div>

                    <div className="desfecho-grid-2">
                      <div className="desfecho-field">
                        <label>Peso (kg):</label>
                        <input 
                          type="number"
                          step="0.01"
                          min="0.1"
                          value={formData.recem_nascidos[0].peso}
                          onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], peso: e.target.value}]})}
                          required
                        />
                      </div>

                      <div className="desfecho-field">
                        <label>Altura (cm):</label>
                        <input 
                          type="number"
                          min="20"
                          value={formData.recem_nascidos[0].altura}
                          onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], altura: e.target.value}]})}
                          required
                        />
                      </div>
                    </div>

                    <div className="desfecho-grid-2">
                      <div className="desfecho-field">
                        <label>APGAR 1 min:</label>
                        <input 
                          type="number"
                          min="0"
                          max="10"
                          value={formData.recem_nascidos[0].apgar_1_min}
                          onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], apgar_1_min: e.target.value}]})}
                          required
                        />
                      </div>

                      <div className="desfecho-field">
                        <label>APGAR 5 min:</label>
                        <input 
                          type="number"
                          min="0"
                          max="10"
                          value={formData.recem_nascidos[0].apgar_5_min}
                          onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], apgar_5_min: e.target.value}]})}
                          required
                        />
                      </div>
                    </div>

                    <div className="desfecho-field">
                      <label>Observações Iniciais do RN:</label>
                      <textarea 
                        value={formData.recem_nascidos[0].observacoes_iniciais}
                        onChange={(e) => setFormData({...formData, recem_nascidos: [{...formData.recem_nascidos[0], observacoes_iniciais: e.target.value}]})}
                        rows={2}
                        placeholder="Observações sobre o recém-nascido..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="desfecho-field">
              <label>Observações:</label>
              <textarea 
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                rows={3}
                placeholder="Observações sobre o desfecho..."
              />
            </div>

            <div className="modal-footer desfecho-footer">
              <BrButton 
              onClick={onClose} 
              style={pageStyles.secundaryButton} 
              type="button">
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