// Cache para dados do formulário e usuários
interface FormDataCache {
  tiposRegistro: string[];
  tiposUsuario: string[];
  ufs: string[];
  lastFetch: number;
}

interface Usuario {
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

interface UsuariosCache {
  data: Usuario[];
  current_page: number;
  last_page: number;
  lastFetch: number;
  page: number;
}

interface Leito {
  id: number;
  numero: string;
  tipo: string;
  capacidade_maxima: number;
  hospital_id: number;
  created_at: string;
  updated_at: string;
}

interface LeitosCache {
  data: Leito[];
  current_page: number;
  last_page: number;
  lastFetch: number;
  page: number;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos
let formCache: FormDataCache | null = null;
const usuariosCache: Map<number, UsuariosCache> = new Map();
const leitosCache: Map<number, LeitosCache> = new Map();

// Cache para dados do formulário
export const getCachedFormData = (): FormDataCache | null => {
  if (!formCache) return null;
  
  const now = Date.now();
  if (now - formCache.lastFetch > CACHE_DURATION) {
    formCache = null;
    return null;
  }
  
  return formCache;
};

export const setCachedFormData = (data: Omit<FormDataCache, 'lastFetch'>): void => {
  formCache = {
    ...data,
    lastFetch: Date.now()
  };
};

// Cache para dados de usuários
export const getCachedUsuarios = (page: number): UsuariosCache | null => {
  const cached = usuariosCache.get(page);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.lastFetch > CACHE_DURATION) {
    usuariosCache.delete(page);
    return null;
  }
  
  return cached;
};

export const setCachedUsuarios = (page: number, data: Omit<UsuariosCache, 'lastFetch' | 'page'>): void => {
  usuariosCache.set(page, {
    ...data,
    page,
    lastFetch: Date.now()
  });
};

// Limpar cache quando dados são modificados
export const clearUsuariosCache = (): void => {
  usuariosCache.clear();
};

// Cache para leitos
export const getCachedLeitos = (page: number): LeitosCache | null => {
  const cached = leitosCache.get(page);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.lastFetch > CACHE_DURATION) {
    leitosCache.delete(page);
    return null;
  }
  
  return cached;
};

export const setCachedLeitos = (page: number, data: Omit<LeitosCache, 'lastFetch' | 'page'>): void => {
  leitosCache.set(page, {
    ...data,
    page,
    lastFetch: Date.now()
  });
};

export const clearLeitosCache = (): void => {
  leitosCache.clear();
};