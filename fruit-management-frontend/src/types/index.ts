export interface FruitRecord {
  id: string;
  date: string;
  productName: string;
  color: string;
  amount: number;
  unit: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
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