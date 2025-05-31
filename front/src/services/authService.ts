// src/services/authService.ts

import api from './axiosConfig';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};


