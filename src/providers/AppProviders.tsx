'use client';

import { useEffect, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './QueryProvider';
import { useAuthStore } from '@/features/auth/auth.store';
import { connectSocket } from '@/lib/socket';

export function AppProviders({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user?.sub) {
      connectSocket();
    }
  }, [user]);

  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
