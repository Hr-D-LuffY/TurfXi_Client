'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { matchStatsApi } from './matchStats.api';
import type { SubmitMatchReportData } from './matchStats.types';

export const MATCH_STATS_KEYS = {
  all: ['matchStats'] as const,
  player: (id: string) => [...MATCH_STATS_KEYS.all, 'player', id] as const,
  leaderboard: (category: string) =>
    [...MATCH_STATS_KEYS.all, 'leaderboard', category] as const,
  headToHead: (teamAId: string, teamBId: string) =>
    [...MATCH_STATS_KEYS.all, 'headToHead', teamAId, teamBId] as const,
};

export function usePlayerStats(playerId: string) {
  return useQuery({
    queryKey: MATCH_STATS_KEYS.player(playerId),
    queryFn: () => matchStatsApi.getPlayerStats(playerId),
    enabled: Boolean(playerId),
  });
}

export function useLeaderboard(category: 'goals' | 'assists' | 'rating' = 'goals') {
  return useQuery({
    queryKey: MATCH_STATS_KEYS.leaderboard(category),
    queryFn: () => matchStatsApi.getLeaderboard(category),
  });
}

export function useHeadToHead(
  teamAId: string | undefined,
  teamBId: string | undefined
) {
  return useQuery({
    queryKey: MATCH_STATS_KEYS.headToHead(teamAId || '', teamBId || ''),
    queryFn: () => matchStatsApi.getHeadToHead(teamAId!, teamBId!),
    enabled: Boolean(teamAId && teamBId),
  });
}

export function useSubmitMatchReport(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitMatchReportData) =>
      matchStatsApi.submitMatchReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCH_STATS_KEYS.all });
      toast.success('Match report submitted and player stats updated!');
      if (onSuccess) onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to submit match report.');
    },
  });
}
