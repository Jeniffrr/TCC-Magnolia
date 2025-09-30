import React, { useState } from 'react';
import api from '../services/api'; // Sua instância configurada do Axios

// Definindo o tipo para os dados do usuário
interface User {
    id: number;
    nome: string;
    email: string;
    // Adicione outros campos conforme necessário
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // 🎯 Requisição POST para o endpoint simples de login
            const response = await api.post('/login', { email, password });

            const { token, user } = response.data;
            
            // 1. Salva o token para uso futuro (CRUD)
            localStorage.setItem('auth_token', token);
            
            // 2. Atualiza o estado da aplicação
            setUser(user);
            setIsLoggedIn(true);

            // 3. Simula o redirecionamento ou exibe a mensagem
            console.log('Login bem-sucedido! Token salvo e usuário:', user.nome);
            // Aqui você usaria o React Router para ir para a página de Administração
            // navigate('/admin/dashboard'); 

        } catch (err: unknown) {
            // Lida com erros (401 Credenciais Inválidas)
            const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro de rede ou servidor.';
            setError(errorMessage);
        }
    };

    if (isLoggedIn && user) {
        return (
            <div style={{ padding: '20px', border: '1px solid green' }}>
                <h2>✅ Login Aprovado!</h2>
                <p>Bem-vindo, **{user.nome}**.</p>
                <p>Seu token de acesso foi salvo no Local Storage.</p>
                <p>Pronto para testar o CRUD!</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Login Provisório</h2>
            <form onSubmit={handleLogin}>
                {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;