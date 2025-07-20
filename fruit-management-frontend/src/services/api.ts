import axios from 'axios';
import { AuthResponse, FruitRecord, PaginatedResponse, CreateFruitRequest, UpdateFruitRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

export const fruitAPI = {
  getAll: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<FruitRecord>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) {
      params.append('search', search);
    }
    const response = await api.get(`/fruits?${params}`);
    const data = {
      ...response.data,
      data: response.data.data.map((fruit: any) => ({
        ...fruit,
        amount: Number(fruit.amount),
        unit: Number(fruit.unit),
        total: Number(fruit.total),
      })),
  };
    
    return data;
  },

  create: async (fruit: CreateFruitRequest): Promise<FruitRecord> => {
    const response = await api.post('/fruits', fruit);
    return response.data;
  },

  update: async (id: string, updates: UpdateFruitRequest): Promise<FruitRecord> => {
    const response = await api.put(`/fruits/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/fruits/${id}`);
  },

  getValidFruits: async (): Promise<{ fruits: string[] }> => {
    const response = await api.get('/fruits/config/valid-fruits');
    return response.data;
  },

  getColorsForFruit: async (fruitName: string): Promise<{ colors: string[] }> => {
    const response = await api.get(`/fruits/config/colors/${fruitName}`);
    return response.data;
  },
};

export default api;