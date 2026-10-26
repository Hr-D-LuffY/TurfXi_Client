import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tournamentsApi } from './tournaments.api';
import type { CreateTournamentFormData } from './tournaments.types';

export const TOURNAMENT_KEYS = {
  all: ['tournaments'] as const,
  lists: () => [...TOURNAMENT_KEYS.all, 'list'] as const,
  list: (params?: { status?: string; search?: string }) =>
    [...TOURNAMENT_KEYS.lists(), params] as const,
  details: () => [...TOURNAMENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TOURNAMENT_KEYS.details(), id] as const,
};

export function useTournaments(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: TOURNAMENT_KEYS.list(params),
    queryFn: () => tournamentsApi.list(params),
  });
}

export function useTournament(id: string) {
  return useQuery({
    queryKey: TOURNAMENT_KEYS.detail(id),
    queryFn: () => tournamentsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTournament(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentFormData) => tournamentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENT_KEYS.lists() });
      toast.success('Tournament created successfully!');
      if (onSuccess) onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create tournament.');
    },
  });
}

export function useRegisterTournamentTeam(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => tournamentsApi.registerTeam(tournamentId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENT_KEYS.detail(tournamentId) });
      toast.success('Your squad has been registered for the tournament!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Team registration failed.');
    },
  });
}

export function useGenerateBracket(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tournamentsApi.generateBracket(tournamentId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENT_KEYS.detail(tournamentId) });
      toast.success(res.message || 'Tournament bracket generated!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to generate bracket.');
    },
  });
}
