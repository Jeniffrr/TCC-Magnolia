import api from '../api/axios';

export interface Leito {
    id: number;
    numero: string;
    tipo: string;
    capacidade_maxima: number;
    hospital_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateLeitoData {
    numero: string;
    tipo: string;
    capacidade_maxima: number;
}

export interface LeitosPaginatedResponse {
    data: Leito[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const getLeitos = async (page: number = 1): Promise<LeitosPaginatedResponse> => {
    const response = await api.get(`/api/leitos?page=${page}`);
    return response.data;
};

export const createLeito = async (data: CreateLeitoData): Promise<Leito> => {
    const response = await api.post('/api/leitos', data);
    return response.data;
};

export const updateLeito = async (id: number, data: Partial<CreateLeitoData>): Promise<Leito> => {
    const response = await api.put(`/api/leitos/${id}`, data);
    return response.data;
};

export const deleteLeito = async (id: number): Promise<void> => {
    await api.delete(`/api/leitos/${id}`);
};

export const getLeito = async (id: number): Promise<Leito> => {
    const response = await api.get(`/api/leitos/${id}`);
    return response.data;
};