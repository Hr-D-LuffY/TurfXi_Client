'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Trophy,
  Users,
  Calendar,
  Wallet,
  Menu,
  X,
  Shield,
  LogOut,
  MapPin,
  Sparkles,
  Flame,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/auth.store';
import { useLogout } from '@/features/auth/auth.hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/turfs', label: 'Turfs', icon: MapPin },
  { href: '/tournaments', label: 'Tournaments', icon: Trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: Flame },
  { href: '/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/missing-players', label: 'Open Slots', icon: Users },
  { href: '/teams', label: 'Squads', icon: Shield },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  const getTierBadge = () => {
    if (!user) return null;
    if (user.membershipTier === 'GOLD') {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="mr-1 h-3 w-3" />
          Gold
        </Badge>
      );
    }
    if (user.membershipTier === 'SILVER') {
      return (
        <Badge className="bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 text-[10px] font-bold uppercase tracking-wider">
          Silver
        </Badge>
      );
    }
    if (user.role === 'TURF_OWNER') {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
          Owner
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">
        Player
      </Badge>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="font-mono font-black text-base tracking-tighter">XI</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground leading-none">
                Turf<span className="text-emerald-600 dark:text-emerald-400">XI</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Dhaka
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section / Auth State */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/players/${user.sub}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {getTierBadge()}
                <span className="text-xs font-semibold text-foreground max-w-[140px] truncate underline-offset-4 hover:underline">
                  {user.email.split('@')[0]}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Join Platform
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && getTierBadge()}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border/80 bg-background px-4 py-4 md:hidden shadow-lg space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-secondary font-semibold text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 text-emerald-600" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border/60 pt-3">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={`/players/${user.sub}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs text-muted-foreground px-3 py-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                    My Player Profile
                  </span>
                  <span className="font-semibold text-emerald-600 underline">
                    View Stats
                  </span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full gap-2 text-xs text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-md border border-input bg-background py-2 text-xs font-medium text-foreground hover:bg-secondary"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
