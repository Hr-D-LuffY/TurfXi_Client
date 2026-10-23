import { apiClient } from '@/lib/apiClient';
import type {
  PlayerStatsData,
  LeaderboardPlayer,
  HeadToHeadStats,
  SubmitMatchReportData,
} from './matchStats.types';

export const matchStatsApi = {
  getPlayerStats: async (playerId: string): Promise<PlayerStatsData> => {
    const res = await apiClient.get<{ data: PlayerStatsData }>(
      `/match-stats/player/${playerId}`
    );
    return res.data;
  },

  getLeaderboard: async (
    category: 'goals' | 'assists' | 'rating' = 'goals'
  ): Promise<LeaderboardPlayer[]> => {
    const res = await apiClient.get<{ data: LeaderboardPlayer[] }>(
      `/match-stats/leaderboard?category=${category}`,
      { skipAuth: true }
    );
    return res.data;
  },

  getHeadToHead: async (
    teamAId: string,
    teamBId: string
  ): Promise<HeadToHeadStats> => {
    const res = await apiClient.get<{ data: HeadToHeadStats }>(
      `/match-stats/head-to-head?teamAId=${encodeURIComponent(
        teamAId
      )}&teamBId=${encodeURIComponent(teamBId)}`
    );
    return res.data;
  },

  submitMatchReport: async (data: SubmitMatchReportData): Promise<unknown> => {
    const res = await apiClient.post<{ data: unknown }>(
      '/match-stats/report',
      data
    );
    return res.data;
  },
};
