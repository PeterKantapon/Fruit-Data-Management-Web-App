export interface FruitRecord {
  id: string;
  date: string;
  productName: string;
  color: string;
  amount: number;
  unit: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  grandTotal?: number;
}

export interface CreateFruitRequest {
  date: string;
  productName: string;
  color: string;
  amount: number;
  unit: number;
}

export interface UpdateFruitRequest {
  date?: string;
  productName?: string;
  color?: string;
  amount?: number;
  unit?: number;
}