const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
}

export interface VaultItem {
  _id: string;
  title: string;
  url?: string;
  encryptedData: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Set auth token in localStorage
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

// Remove auth token from localStorage
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('master_key');
}

// Make authenticated API request
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Auth API calls
export const authApi = {
  async register(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async verify(): Promise<{ valid: boolean; user: User }> {
    return apiRequest<{ valid: boolean; user: User }>('/auth/verify');
  },
};

// Vault API calls
export const vaultApi = {
  async getAll(search?: string): Promise<{ vaultItems: VaultItem[] }> {
    const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest<{ vaultItems: VaultItem[] }>(`/vault${searchParam}`);
  },

  async getById(id: string): Promise<{ vaultItem: VaultItem }> {
    return apiRequest<{ vaultItem: VaultItem }>(`/vault/${id}`);
  },

  async create(data: {
    title: string;
    url?: string;
    encryptedData: string;
  }): Promise<{ message: string; vaultItem: VaultItem }> {
    return apiRequest<{ message: string; vaultItem: VaultItem }>('/vault', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      url?: string;
      encryptedData?: string;
    }
  ): Promise<{ message: string; vaultItem: VaultItem }> {
    return apiRequest<{ message: string; vaultItem: VaultItem }>(`/vault/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/vault/${id}`, {
      method: 'DELETE',
    });
  },
};
