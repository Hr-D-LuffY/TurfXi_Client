import { useQuery } from '@tanstack/react-query';
import { turfsApi } from './turfs.api';

export const TURF_KEYS = {
  all: ['turfs'] as const,
  lists: () => [...TURF_KEYS.all, 'list'] as const,
  list: (filters?: { area?: string; city?: string; search?: string }) =>
    [...TURF_KEYS.lists(), filters] as const,
  details: () => [...TURF_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TURF_KEYS.details(), id] as const,
};

export function useTurfs(filters?: { area?: string; city?: string; search?: string }) {
  return useQuery({
    queryKey: TURF_KEYS.list(filters),
    queryFn: () => turfsApi.list(filters),
  });
}

export function useTurf(id: string) {
  return useQuery({
    queryKey: TURF_KEYS.detail(id),
    queryFn: () => turfsApi.getById(id),
    enabled: Boolean(id),
  });
}
