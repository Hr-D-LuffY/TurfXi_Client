import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// The pairing of js-cookie + jwt-decode implies a specific pattern: the
// access token lives in a regular (non-httpOnly) cookie so client
// JavaScript can read it, and gets decoded locally to read the user's
// claims without a round-trip to the backend. It's still attached to
// requests as a Bearer header (see apiClient.ts), not sent implicitly —
// this is a deliberate choice, not the browser's automatic cookie
// behavior. Confirm this matches what the backend's auth module actually
// issues (TODO in features/auth) before relying on it.

const TOKEN_COOKIE_NAME = 'turfxi_token';

// Mirrors the backend's Role / MembershipTier enums (prisma/schema.prisma).
// Duplicated here deliberately — the frontend has no direct access to the
// Prisma-generated types, so keep this in sync by hand if those enums change.
export type Role = 'NORMAL' | 'PLAYER' | 'TURF_OWNER' | 'ADMIN';
export type MembershipTier = 'FREE' | 'SILVER' | 'GOLD';

export interface DecodedToken {
  sub: string; // user id
  email: string;
  role: Role;
  membershipTier: MembershipTier;
  exp: number;
  iat: number;
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE_NAME);
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: 7, // days — should match the backend's JWT_EXPIRES_IN in spirit
  });
}

export function clearToken(): void {
  Cookies.remove(TOKEN_COOKIE_NAME);
}

export function getDecodedUser(): DecodedToken | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 < Date.now()) {
      clearToken();
      return null;
    }
    return decoded;
  } catch {
    clearToken();
    return null;
  }
}
