import { apiClient } from '@/lib/apiClient';
import type { Turf } from './turfs.types';

export const turfsApi = {
  list: async (filters?: { area?: string; city?: string; search?: string }): Promise<Turf[]> => {
    const params = new URLSearchParams();
    if (filters?.area) params.append('area', filters.area);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.search) params.append('search', filters.search);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<{ data: Turf[] }>(`/turfs${queryString}`, {
      skipAuth: true,
    });
    return res.data;
  },

  getById: async (id: string): Promise<Turf> => {
    const res = await apiClient.get<{ data: Turf }>(`/turfs/${id}`, {
      skipAuth: true,
    });
    return res.data;
  },
};
