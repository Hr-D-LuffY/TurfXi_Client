'use client';

import { create } from 'zustand';
import { getDecodedUser, clearToken, type DecodedToken } from '@/lib/auth-token';

interface AuthState {
  user: DecodedToken | null;
  setUser: (user: DecodedToken | null) => void;
  logout: () => void;
  /** Re-reads the cookie and syncs state — call on app mount. */
  hydrate: () => void;
}

// Small, non-server piece of global state (the decoded token claims) — this
// is exactly the kind of thing zustand is for; server data itself still
// goes through TanStack Query, not this store.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    clearToken();
    set({ user: null });
  },
  hydrate: () => set({ user: getDecodedUser() }),
}));
