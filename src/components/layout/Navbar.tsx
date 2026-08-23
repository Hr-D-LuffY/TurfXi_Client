'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/auth.store';

const links = [
  { href: '/turfs', label: 'Turfs' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/missing-players', label: 'Missing Players' },
  { href: '/teams', label: 'Teams' },
  { href: '/tournaments', label: 'Tournaments' },
  { href: '/wallet', label: 'Wallet' },
];

export function Navbar() {
  const { user, hydrate, logout } = useAuthStore();

  // Cookie can only be read client-side, so sync the store once on mount
  // rather than trying to read it during server render.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <header className="border-b border-neutral-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          TurfXI
        </Link>
        <div className="flex gap-5 text-sm text-neutral-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-neutral-950">
              {link.label}
            </Link>
          ))}
          {/* TODO (admin module owner): only show this link when user.role === 'ADMIN' */}
        </div>
        <div className="flex gap-4 text-sm">
          {user ? (
            <>
              {/* TODO (auth): replace with a real profile menu / wallet balance / notification bell */}
              <span className="text-neutral-600">{user.email}</span>
              <button onClick={logout} className="font-medium text-neutral-950">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-neutral-600 hover:text-neutral-950">
                Log in
              </Link>
              <Link href="/register" className="font-medium text-neutral-950">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
