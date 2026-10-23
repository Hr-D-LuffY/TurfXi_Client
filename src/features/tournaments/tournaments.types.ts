import { z } from 'zod';

export const createTournamentSchema = z.object({
  name: z.string().trim().min(3, 'Tournament name must be at least 3 characters'),
  hostTurfId: z.string().min(1, 'Please select a host turf venue'),
  entryFee: z.number().min(0, 'Entry fee cannot be negative'),
  prizeInfo: z.string().optional(),
  rules: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export type CreateTournamentFormData = z.infer<typeof createTournamentSchema>;

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number;
  scheduledAt: string;
  teamA?: { id: string; name: string; logoUrl?: string | null } | null;
  teamB?: { id: string; name: string; logoUrl?: string | null } | null;
  turf?: { id: string; name: string } | null;
  match?: { id: string; scoreA?: number | null; scoreB?: number | null } | null;
}

export interface TournamentTeamEntry {
  id: string;
  tournamentId: string;
  teamId: string;
  seed?: number | null;
  team: {
    id: string;
    name: string;
    logoUrl?: string | null;
    captain?: { id: string; name: string } | null;
    _count?: { members: number };
  };
}

export interface Tournament {
  id: string;
  name: string;
  organizerId: string;
  hostTurfId?: string | null;
  entryFee: string | number;
  prizeInfo?: string | null;
  rules?: string | null;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'DRAFT';
  startDate: string;
  endDate: string;
  createdAt: string;
  hostTurf?: {
    id: string;
    name: string;
    city: string;
    area: string;
    pricePerHour?: string | number;
    photos?: Array<{ id: string; url: string }>;
  } | null;
  organizer?: {
    id: string;
    name: string;
    email?: string;
    role?: string;
    membershipTier?: string;
  } | null;
  teamEntries?: TournamentTeamEntry[];
  matches?: TournamentMatch[];
  _count?: {
    teamEntries: number;
    matches: number;
  };
}
