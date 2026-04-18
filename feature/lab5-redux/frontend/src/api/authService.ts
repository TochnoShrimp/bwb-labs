import axiosInstance from './axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const register = (data: RegisterData) =>
  axiosInstance.post<{ message: string; userId: number }>('/auth/register', data);

export const login = (data: LoginData) => axiosInstance.post<AuthResponse>('/auth/login', data);

export const logout = () => axiosInstance.post('/auth/logout');

export const getUserProfile = () => {
  return axiosInstance.get('/users/profile/me');
};