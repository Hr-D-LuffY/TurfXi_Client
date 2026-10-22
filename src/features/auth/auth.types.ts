import { z } from 'zod';
import type { Role, MembershipTier } from '@/lib/auth-token';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['NORMAL', 'PLAYER', 'TURF_OWNER'] as const),
  isPlayerProfile: z.boolean(),
  position: z.string().optional(),
  preferredFoot: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  skillLevel: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export interface PlayerProfile {
  id: string;
  userId: string;
  position?: string | null;
  preferredFoot?: string | null;
  city?: string | null;
  area?: string | null;
  skillLevel?: string | null;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: string | number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  membershipTier: MembershipTier;
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
  playerProfile?: PlayerProfile | null;
  wallet?: Wallet | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
