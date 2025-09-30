import api from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  tipo_usuario: string;
  tipo_registro: string;
  numero_registro: string;
  uf_registro: string;
  is_active: boolean;
}

export interface PaginatedResponse {
  data: Usuario[];
  current_page: number;
  last_page: number;
  total: number;
}

export const getUsuarios = async (page: number = 1): Promise<PaginatedResponse> => {
  const response = await api.get(`/usuarios?page=${page}`);
  return response.data;
};

export const toggleUsuarioStatus = async (userId: number): Promise<void> => {
  await api.patch(`/usuarios/${userId}/status`);
};

export const deleteUsuario = async (userId: number): Promise<void> => {
  await api.delete(`/usuarios/${userId}`);
};

export const createUsuario = async (userData: Partial<Usuario>): Promise<Usuario> => {
  const response = await api.post('/usuarios/cadastrar', userData);
  return response.data.usuario;
};

export const updateUsuario = async (userId: number, userData: Partial<Usuario>): Promise<Usuario> => {
  const response = await api.put(`/usuarios/${userId}`, userData);
  return response.data.usuario;
};

export const getUsuario = async (userId: number): Promise<Usuario> => {
  const response = await api.get(`/usuarios/${userId}`);
  return response.data;
};

export const getTiposRegistro = async (): Promise<string[]> => {
    const response = await api.get('/tipos-registro');
    return response.data;
};

export const getUfs = async (): Promise<string[]> => {
    const response = await api.get('/ufs');
    return response.data;
};

export const getTiposUsuario = async (): Promise<string[]> => {
    const response = await api.get('/tipos-usuario');
    return response.data;
};