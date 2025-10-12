import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // backend Laravel
  withCredentials: true, // importante para cookies do Sanctum
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Primeiro obter o CSRF token
export const getCsrfToken = async () => {
    await api.get('/sanctum/csrf-cookie');
};

// Função de login
export const login = async (credentials: { email: string; password: string }) => {
    await getCsrfToken();
    return api.post('/login', credentials);
};

// Função de registro
export const register = async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    password_confirmation: string;
}) => {
    await getCsrfToken();
    return api.post('/primeiro-acesso/registrar', userData);
};

export default api;

