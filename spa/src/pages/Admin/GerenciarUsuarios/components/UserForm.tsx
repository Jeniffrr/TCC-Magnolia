import React, { useState, useEffect } from 'react';
import { 
    createUsuario, 
    updateUsuario, 
    getTiposRegistro, 
    getUfs,
    getTiposUsuario
} from '../../../../services/adminService';
import type { Usuario } from '../../../../services/adminService';
import { BrButton } from '@govbr-ds/react-components';
import BrInputIcon from '../../../../components/BrInputIcon/BrInputIcon';
import { pageStyles, getFieldStatus, getFeedbackText } from '../../../../assets/style/pageStyles';
import { getCachedFormData, setCachedFormData } from '../../../../utils/formDataCache';
import { Loading } from '../../../../components/Loading/Loading';

// Tradução de mensagens de erro
const translateErrorMessage = (message: string): string => {
    const translations: Record<string, string> = {
        'The name field is required.': 'O campo nome é obrigatório.',
        'The email field is required.': 'O campo e-mail é obrigatório.',
        'The email must be a valid email address.': 'O e-mail deve ser um endereço válido.',
        'The cpf field is required.': 'O campo CPF é obrigatório.',
        'The senha field is required.': 'O campo senha é obrigatório.',
        'The senha must be at least 8 characters.': 'A senha deve ter pelo menos 8 caracteres.',
        'The senha confirmation does not match.': 'A confirmação da senha não confere.',
        'The tipo_usuario field is required.': 'O campo tipo de usuário é obrigatório.',
        'The tipo_registro field is required.': 'O campo tipo de registro é obrigatório.',
        'The numero_registro field is required.': 'O campo número do registro é obrigatório.',
        'The uf_registro field is required.': 'O campo UF do registro é obrigatório.',
        'Validation failed': 'Erro de validação',
        'The given data was invalid.': 'Os dados fornecidos são inválidos.',
        'Unauthenticated.': 'Não autenticado. Faça login novamente.',
        'Unauthorized.': 'Não autorizado para esta ação.',
    };
    
    return translations[message] || message;
};

const translateErrors = (errors: Record<string, string[]>): Record<string, string[]> => {
    const translatedErrors: Record<string, string[]> = {};
    
    Object.keys(errors).forEach(key => {
        translatedErrors[key] = errors[key].map(translateErrorMessage);
    });
    
    return translatedErrors;
};

interface UserFormProps {
    userToEdit?: Usuario | null;
    onSuccess: () => void; 
    onCancel: () => void;
}

const initialFormState = {
    nome: '', email: '', cpf: '',
    senha: '', senha_confirmation: '',
    tipo_usuario: 'medico',
    tipo_registro: 'CRM',
    numero_registro: '', uf_registro: 'GO',
};

interface FormData {
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    senha_confirmation: string;
    tipo_usuario: string;
    tipo_registro: string;
    numero_registro: string;
    uf_registro: string;
}

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onSuccess, onCancel }) => {
    const isEditMode = !!userToEdit;
    const [formData, setFormData] = useState<FormData>(initialFormState);
    const [tiposRegistro, setTiposRegistro] = useState<string[]>([]);
    const [tiposUsuario, setTiposUsuario] = useState<string[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message?: string; errors?: Record<string, string[]> } | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const loadFormData = async () => {
            // Verifica cache primeiro
            const cachedData = getCachedFormData();
            if (cachedData) {
                setTiposRegistro(cachedData.tiposRegistro);
                setUfs(cachedData.ufs);
                setTiposUsuario(cachedData.tiposUsuario);
                return;
            }
            
            // Só mostra loading se não tem cache
            setLoading(true);
            try {
                const [tiposReg, ufList, tiposUser] = await Promise.all([
                    getTiposRegistro(), 
                    getUfs(), 
                    getTiposUsuario()
                ]);
                
                // Salva no cache
                setCachedFormData({
                    tiposRegistro: tiposReg,
                    ufs: ufList,
                    tiposUsuario: tiposUser
                });
                
                setTiposRegistro(tiposReg);
                setUfs(ufList);
                setTiposUsuario(tiposUser);
            } catch {
                setError({ message: 'Erro ao carregar dados do formulário. Verifique sua conexão.' });
            } finally {
                setLoading(false);
            }
        };

        loadFormData();
        
        // Preenche dados para edição
        if (isEditMode && userToEdit) {
            setFormData({
                nome: userToEdit.nome,
                email: userToEdit.email,
                cpf: userToEdit.cpf,
                tipo_usuario: userToEdit.tipo_usuario,
                tipo_registro: userToEdit.tipo_registro,
                uf_registro: userToEdit.uf_registro,
                senha: '',
                senha_confirmation: '',
                numero_registro: userToEdit.numero_registro,
            });
        }
    }, [isEditMode, userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const payload: Partial<FormData> = { ...formData };
            
            // No modo de edição, remove apenas campos de senha vazios
            if (isEditMode) {
                if (!formData.senha) {
                    delete payload.senha;
                    delete payload.senha_confirmation;
                }
            }

            if (isEditMode && userToEdit) {
                await updateUsuario(userToEdit.id, payload);
            } else {
                await createUsuario(payload);
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
                    message: translateErrorMessage(errorData.message || 'Erro de validação'),
                    errors: translateErrors(errorData.errors)
                });
            } else {
                setError({ 
                    message: translateErrorMessage(errorData?.message || (isEditMode ? 'Erro ao atualizar usuário. Tente novamente.' : 'Erro ao cadastrar usuário. Tente novamente.'))
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Só mostra loading se não tem dados em cache
    if (loading && tiposRegistro.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loading message="Carregando formulário..." />
            </div>
        );
    }

    return (
        <div className="register-container">
            {showSuccess && (
                <div className="alert-card success">
                    <i className="fas fa-check-circle"></i>
                    {isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!'}
                </div>
            )}
            
            {error?.message && (
                <div className="alert-card error">
                    <i className="fas fa-exclamation-triangle"></i>
                    {translateErrorMessage(error.message)}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <h3 style={pageStyles.sectionTitle}>Dados Pessoais</h3>
                <hr  />
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '2', minWidth: '600px', marginTop: '20px' }}>
                        <BrInputIcon
                            label="Nome Completo"
                            name="nome"
                            type="text"
                            value={formData.nome}
                            onChange={handleChange}
                            maxLength={255}
                            icon="fas fa-user"
                            status={getFieldStatus(error?.errors?.nome?.[0])}
                            feedbackText={getFeedbackText(error?.errors?.nome?.[0] ? translateErrorMessage(error.errors.nome[0]) : undefined)}
                        />
                    </div>
                    <div style={{ flex: '1', minWidth: '300px', marginTop: '20px'}}>
                        <BrInputIcon
                            label="CPF"
                            name="cpf"
                            type="text"
                            value={formData.cpf}
                            onChange={handleChange}
                            placeholder="000.000.000-00"
                            icon="fas fa-id-badge"
                            status={getFieldStatus(error?.errors?.cpf?.[0])}
                            feedbackText={getFeedbackText(error?.errors?.cpf?.[0] ? translateErrorMessage(error.errors.cpf[0]) : undefined)}
                        />
                    </div>
                </div>

                <div style={{ flex: '1', minWidth: '800px' }}>
                    <BrInputIcon
                        label="E-mail*"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        icon="fas fa-envelope"
                        status={getFieldStatus(error?.errors?.email?.[0])}
                        feedbackText={getFeedbackText(error?.errors?.email?.[0] ? translateErrorMessage(error.errors.email[0]) : undefined)}
                    />
                </div>

                <h3 style={pageStyles.userSectionTitle}>Dados Profissionais</h3>
                <hr />
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                    <div style={{ flex: '1', minWidth: '500px', marginTop: '20px' }}>
                        <div>
                            <label>Tipo de Usuário*</label>
                            <select
                                name="tipo_usuario"
                                value={formData.tipo_usuario}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                {tiposUsuario.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ flex: '1', minWidth: '500px' , marginTop: '20px'}}>
                        <div>
                            <label>Tipo de Registro*</label>
                            <select
                                name="tipo_registro"
                                value={formData.tipo_registro}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                {tiposRegistro.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <BrInputIcon
                            label="Número do Registro*"
                            name="numero_registro"
                            type="text"
                            value={formData.numero_registro}
                            onChange={handleChange}
                            placeholder="Número do CRM/COREN"
                            icon="fas fa-id-card"
                            status={getFieldStatus(error?.errors?.numero_registro?.[0])}
                            feedbackText={getFeedbackText(error?.errors?.numero_registro?.[0] ? translateErrorMessage(error.errors.numero_registro[0]) : undefined)}
                        />
                    </div>
                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <div>
                            <label>UF do Registro*</label>
                            <select
                                name="uf_registro"
                                value={formData.uf_registro}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <h3 style={pageStyles.userSectionTitle}>Dados de Acesso</h3>
                <hr  />
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '300px', marginTop: '20px' }}>
                        <div style={{ marginBottom: '6px', fontSize: '16px', color: '#666' }}>
                            {isEditMode ? 'Deixe em branco para manter a senha atual' : 'A senha deve ter pelo menos 8 caracteres'}
                        </div>
                        <BrInputIcon
                            label={isEditMode ? "Nova Senha" : "Senha*"}
                            name="senha"
                            type="password"
                            value={formData.senha}
                            onChange={handleChange}
                            icon="fas fa-lock"
                            status={getFieldStatus(error?.errors?.senha?.[0])}
                            feedbackText={getFeedbackText(error?.errors?.senha?.[0] ? translateErrorMessage(error.errors.senha[0]) : undefined)}
                        />
                    </div>
                    <div style={{ flex: '1', minWidth: '300px', marginTop: '45px' }}>
                        <BrInputIcon
                            label={isEditMode ? "Confirmar Nova Senha" : "Confirmar Senha*"}
                            name="senha_confirmation"
                            type="password"
                            value={formData.senha_confirmation}
                            onChange={handleChange}
                            icon="fas fa-lock"
                            status={getFieldStatus(error?.errors?.senha_confirmation?.[0])}
                            feedbackText={getFeedbackText(error?.errors?.senha_confirmation?.[0] ? translateErrorMessage(error.errors.senha_confirmation[0]) : undefined)}
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
                        className="register-button" 
                        disabled={loading}
                        style={pageStyles.primaryButton}
                    >
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #ffffff40',
                                    borderTop: '2px solid #ffffff',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                Processando...
                            </div>
                        ) : (isEditMode ? 'Salvar Edições' : 'Cadastrar')}
                    </BrButton>
                </div>
            </form>
        </div>
    );
};

export default UserForm;