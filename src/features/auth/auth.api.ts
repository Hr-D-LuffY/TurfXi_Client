import { apiClient } from '@/lib/apiClient';
import type {
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  User,
} from './auth.types';

export const authApi = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await apiClient.post<{ data: AuthResponse }>('/auth/login', data, {
      skipAuth: true,
    });
    return res.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.isPlayerProfile ? 'PLAYER' : data.role,
      ...(data.isPlayerProfile
        ? {
            playerProfile: {
              position: data.position || undefined,
              preferredFoot: data.preferredFoot || undefined,
              city: data.city || undefined,
              area: data.area || undefined,
              skillLevel: data.skillLevel || undefined,
            },
          }
        : {}),
    };

    const res = await apiClient.post<{ data: AuthResponse }>('/auth/register', payload, {
      skipAuth: true,
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const res = await apiClient.post<{ data: { accessToken: string } }>('/auth/refresh', {}, {
      skipAuth: true,
    });
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<{ data: { user: User } }>('/auth/me');
    return res.data.user;
  },
};
