import React, { useState } from 'react';
import { createLeito, updateLeito, type Leito, type CreateLeitoData } from '../../../../services/leitoService';
import { BrButton } from '@govbr-ds/react-components';
import BrInputIcon from '../../../../components/BrInputIcon/BrInputIcon';
import { pageStyles, getFieldStatus, getFeedbackText } from '../../../../assets/style/pageStyles';

interface LeitoFormProps {
    leitoToEdit?: Leito | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const LeitoForm: React.FC<LeitoFormProps> = ({ leitoToEdit, onSuccess, onCancel }) => {
    const isEditMode = !!leitoToEdit;
    const [formData, setFormData] = useState<CreateLeitoData>({
        numero: leitoToEdit?.numero || '',
        tipo: leitoToEdit?.tipo || 'UTI',
        capacidade_maxima: leitoToEdit?.capacidade_maxima || 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message?: string; errors?: Record<string, string[]> } | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const tiposLeito = ['UTI', 'Enfermaria', 'Emergência', 'Cirúrgico', 'Maternidade', 'Pediatria'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacidade_maxima' ? parseInt(value) || 1 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode && leitoToEdit) {
                await updateLeito(leitoToEdit.id, formData);
            } else {
                await createLeito(formData);
            }

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSuccess();
            }, 2000);

        } catch (err: unknown) {
            const errorData = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }).response?.data;
            if (errorData?.errors) {
                setError({
                    message: errorData.message || 'Erro de validação',
                    errors: errorData.errors
                });
            } else {
                setError({
                    message: errorData?.message || (isEditMode ? 'Erro ao atualizar leito' : 'Erro ao cadastrar leito')
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {showSuccess && (
                <div className="alert-card success">
                    <i className="fas fa-check-circle"></i>
                    {isEditMode ? 'Leito atualizado com sucesso!' : 'Leito cadastrado com sucesso!'}
                </div>
            )}

            {error?.message && (
                <div className="alert-card error">
                    <i className="fas fa-exclamation-triangle"></i>
                    {error.message}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <h3 style={pageStyles.sectionTitle}>Dados do Leito</h3>
                <hr />

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <BrInputIcon
                            label="Número do Leito*"
                            name="numero"
                            type="text"
                            value={formData.numero}
                            onChange={handleChange}
                            maxLength={10}
                            icon="fas fa-bed"
                            status={getFieldStatus(error?.errors?.numero?.[0])}
                            feedbackText={getFeedbackText(error?.errors?.numero?.[0])}
                        />
                    </div>

                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label>Tipo de Leito*</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            {tiposLeito.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <BrInputIcon
                            label="Capacidade Máxima*"
                            name="capacidade_maxima"
                            type="number"
                            value={formData.capacidade_maxima.toString()}
                            onChange={handleChange}
                            min="1"
                            icon="fas fa-users"
                            status={getFieldStatus(error?.errors?.capacidade_maxima?.[0])}
                            feedbackText={getFeedbackText(error?.errors?.capacidade_maxima?.[0])}
                        />
                    </div>
                </div>

                <div style={pageStyles.buttonContainer}>
                    <BrButton
                        type="button"
                        style={pageStyles.secundaryButton}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </BrButton>
                    <BrButton
                        type="submit"
                        disabled={loading}
                        style={pageStyles.primaryButton}
                    >
                        {loading ? 'Processando...' : (isEditMode ? 'Salvar Edições' : 'Cadastrar')}
                    </BrButton>
                </div>
            </form>
        </div>
    );
};

export default LeitoForm;