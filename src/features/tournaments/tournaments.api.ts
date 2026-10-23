import { apiClient } from '@/lib/apiClient';
import type {
  CreateTournamentFormData,
  Tournament,
  TournamentTeamEntry,
} from './tournaments.types';

export const tournamentsApi = {
  list: async (params?: { status?: string; search?: string }): Promise<Tournament[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await apiClient.get<{ data: Tournament[] }>(`/tournaments${queryString}`, {
      skipAuth: true,
    });
    return res.data;
  },

  getById: async (id: string): Promise<Tournament> => {
    const res = await apiClient.get<{ data: Tournament }>(`/tournaments/${id}`, {
      skipAuth: true,
    });
    return res.data;
  },

  create: async (data: CreateTournamentFormData): Promise<Tournament> => {
    const res = await apiClient.post<{ data: Tournament }>('/tournaments', data);
    return res.data;
  },

  registerTeam: async (
    tournamentId: string,
    teamId: string
  ): Promise<TournamentTeamEntry> => {
    const res = await apiClient.post<{ data: TournamentTeamEntry }>(
      `/tournaments/${tournamentId}/teams`,
      { teamId }
    );
    return res.data;
  },

  generateBracket: async (
    tournamentId: string
  ): Promise<{ message: string; matchesCount: number; rounds: number }> => {
    const res = await apiClient.post<{
      data: { message: string; matchesCount: number; rounds: number };
    }>(`/tournaments/${tournamentId}/generate-bracket`);
    return res.data;
  },
};
