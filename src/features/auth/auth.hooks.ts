import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from './auth.api';
import { setToken, clearToken } from '@/lib/auth-token';
import { useAuthStore } from './auth.store';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import type { LoginFormData, RegisterFormData, User } from './auth.types';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
};

export function useMe() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.getMe,
    enabled: Boolean(user?.sub),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hydrate = useAuthStore((s) => s.hydrate);

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      setToken(data.accessToken);
      hydrate();
      connectSocket();
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      toast.success('Welcome back to TurfXI!');
      router.push('/turfs');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hydrate = useAuthStore((s) => s.hydrate);

  return useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    onSuccess: (data) => {
      setToken(data.accessToken);
      hydrate();
      connectSocket();
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      toast.success('Account created successfully! Welcome to TurfXI.');
      router.push('/turfs');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Registration failed. Please check your details.');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearToken();
      logoutStore();
      disconnectSocket();
      queryClient.removeQueries({ queryKey: AUTH_KEYS.me });
      toast.info('You have been logged out.');
      router.push('/login');
    },
  });
}
