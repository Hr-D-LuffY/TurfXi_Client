export type MembershipTier = 'FREE' | 'SILVER' | 'GOLD';

export interface PlayerProfile {
  id: string;
  userId: string;
  position: string | null;
  preferredFoot: string | null;
  city: string | null;
  area: string | null;
  skillLevel: string | null;
}

export interface PlayerTeam {
  id: string;
  name: string;
  logoUrl: string | null;
  captainId: string;
  viceCaptainId: string | null;
  createdAt: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
}

export interface MatchHistoryItem {
  id: string;
  matchId: string;
  date: string;
  venue: string;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  personalGoals: number;
  personalAssists: number;
  personalRating: number | null;
}

export interface GoldInsights {
  percentileRating: number;
  headToHeadPredictionPower: string;
  cityRank: number;
}

export interface PlayerStatsData {
  id: string;
  name: string;
  email: string;
  role: 'NORMAL' | 'PLAYER' | 'TURF_OWNER' | 'ADMIN';
  membershipTier: MembershipTier;
  playerProfile: PlayerProfile | null;
  team: PlayerTeam | null;
  matchesPlayed: number;
  tierGated: boolean;
  previewStats?: {
    goals: number;
    assists: number;
    avgRating: number;
  };
  stats?: {
    matchesPlayed: number;
    goals: number;
    assists: number;
    saves: number;
    avgRating: number;
    wins: number;
    winRate: number;
    form: Array<'W' | 'D' | 'L'>;
  };
  badges?: AchievementBadge[];
  matchHistory?: MatchHistoryItem[];
  goldInsights?: GoldInsights;
}

export interface LeaderboardPlayer {
  rank: number;
  playerId: string;
  name: string;
  position: string;
  city: string;
  area: string;
  teamName: string;
  goals: number;
  assists: number;
  avgRating: number;
  matchesPlayed: number;
}

export interface HeadToHeadStats {
  teamA: { id: string; name: string; wins: number; goals: number; winProbability: number };
  teamB: { id: string; name: string; wins: number; goals: number; winProbability: number };
  draws: number;
  totalMatches: number;
  recentMatches: Array<{
    id: string;
    scoreA: number | null;
    scoreB: number | null;
    date: string;
  }>;
}

export interface SubmitMatchReportData {
  bookingId: string;
  teamAId?: string;
  teamBId?: string;
  scoreA: number;
  scoreB: number;
  playerStats: Array<{
    playerId: string;
    goals: number;
    assists: number;
    saves: number;
    rating?: number;
    position?: string;
  }>;
}
