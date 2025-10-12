import { useState, useEffect } from 'react';

interface User {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    console.log('useAuth - token:', token);
    console.log('useAuth - userData:', userData);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        console.log('useAuth - user parsed:', user);
        setAuthState({
          isAuthenticated: true,
          user,
          token
        });
      } catch (error) {
        console.error('useAuth - erro ao parsear user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      user,
      token
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};