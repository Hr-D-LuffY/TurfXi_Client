'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './QueryProvider';

// Single place to stack app-wide providers. Add a SocketProvider here once
// the auth module defines how sessions connect the socket.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      {/* Global toast host — call toast.error(...) / toast.success(...) from
          anywhere. TODO (error handling): hook TanStack Query's global
          onError into this so backend error messages surface automatically. */}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
