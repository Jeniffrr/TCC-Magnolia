import React, { useState } from 'react';
import axios from "../api/axios";
import { isAxiosError } from "axios";

// Definindo os tipos para as props e o estado
type LoginProps = object
interface LoginState {
    email: string;
    password: string;
}

// Componente para o desafio de 2FA
type TwoFactorChallengeProps = object
const TwoFactorChallenge: React.FC<TwoFactorChallengeProps> = () => {
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:8000/two-factor-challenge', {
                code: code,
            }, { withCredentials: true });
            console.log("2FA successful!");
            window.location.href = '/dashboard';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Código de autenticação inválido.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Autenticação de Dois Fatores</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Código:</label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Validar Código</button>
        </form>
    );
};
  
// Componente principal de Login
const Login: React.FC<LoginProps> = () => {
    const [state, setState] = useState<LoginState>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');
    const [needsTwoFactor, setNeedsTwoFactor] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true }); // Obtém o CSRF
            
            await axios.post('http://localhost:8000/login', state, { withCredentials: true });
            console.log("Login successful!");
            window.location.href = '/dashboard';
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                if (err.response.status === 409) {
                    setNeedsTwoFactor(true);
                } else {
                    setError('Falha no login. Verifique suas credenciais.');
                }
            } else {
                setError('Erro de rede. Tente novamente.');
            }
        }
    };

    if (needsTwoFactor) {
        return <TwoFactorChallenge />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Senha:</label>
                <input
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Entrar</button>
        </form>
    );
};

export default Login;