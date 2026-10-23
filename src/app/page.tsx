'use client';

import Link from 'next/link';
import {
  Trophy,
  MapPin,
  Users,
  Coins,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-secondary/20 to-background py-16 sm:py-24">
        {/* Subtle pitch texture background */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Flame className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span>Dhaka&apos;s Premier Sports Turf & League Platform</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.15]">
            Book your pitch.{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              Split the bill.
            </span>{' '}
            Win the cup.
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Reserve verified 5-a-side and 7-a-side turfs across Dhaka in seconds, automatically split costs among your squad with in-app wallets, and compete in seeded knockout tournaments.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/turfs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <CalendarCheck className="h-4 w-4" />
              Browse Pitches
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/tournaments"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-xs hover:bg-secondary transition-colors"
            >
              <Trophy className="h-4 w-4 text-emerald-600" />
              View Tournaments
            </Link>
          </div>

          {/* Social Proof / Key Highlights Bar */}
          <div className="pt-8 border-t border-border/60 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto text-left">
            <div className="space-y-1 p-2">
              <span className="text-xl sm:text-2xl font-black text-foreground">100%</span>
              <p className="text-xs text-muted-foreground">Guaranteed Slot Booking</p>
            </div>

            <div className="space-y-1 p-2">
              <span className="text-xl sm:text-2xl font-black text-emerald-600">15-Min</span>
              <p className="text-xs text-muted-foreground">Auto Split-Billing Window</p>
            </div>

            <div className="space-y-1 p-2">
              <span className="text-xl sm:text-2xl font-black text-foreground">3 Tiers</span>
              <p className="text-xs text-muted-foreground">Free, Silver & Gold Stats</p>
            </div>

            <div className="space-y-1 p-2">
              <span className="text-xl sm:text-2xl font-black text-emerald-600">Knockout</span>
              <p className="text-xs text-muted-foreground">Auto-Bracket Tournaments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 bg-card border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineered for Competitive Football in Dhaka
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Everything teams and venue owners need in one seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Pillar 1 */}
            <Card className="border-border/80 shadow-xs hover:border-foreground/30 transition-all">
              <CardHeader className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Coins className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-foreground">
                  Automated Split-Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>
                  No more chasing friends for cash. The booker pays an advance, invites players, and everyone pays their exact share directly from their in-app wallet within 15 minutes.
                </p>
                <div className="pt-2 flex items-center gap-1.5 font-medium text-foreground text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>bKash, Nagad, Rocket & Cards supported</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="border-border/80 shadow-xs hover:border-foreground/30 transition-all">
              <CardHeader className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-foreground">
                  Missing Players Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Short 1 goalkeeper or 2 defenders? Post an open slot in your booking. Nearby verified players receive match notifications and can request to join in real-time.
                </p>
                <div className="pt-2 flex items-center gap-1.5 font-medium text-foreground text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Position, area, and skill-level matching</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="border-border/80 shadow-xs hover:border-foreground/30 transition-all">
              <CardHeader className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Trophy className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-foreground">
                  Seeded Tournament Brackets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Gold members and Turf Owners can host cups with custom prize pools. The platform auto-seeds registered squads and schedules single-elimination brackets.
                </p>
                <div className="pt-2 flex items-center gap-1.5 font-medium text-foreground text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Live match tracking & tournament MVP awards</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Featured Dhaka Turf Venues
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Verified high-quality pitches with floodlights and locker facilities.
              </p>
            </div>

            <Link
              href="/turfs"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              See all venues
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Venue 1 */}
            <Card className="overflow-hidden border-border/80 group">
              <div className="relative h-48 w-full overflow-hidden bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1529900240041-22f114d18e40?w=800"
                  alt="Apex Turf Arena"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-base font-bold">Apex Turf Arena Dhanmondi</h3>
                  <p className="text-xs text-neutral-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    Road 27 (Old), Dhanmondi, Dhaka
                  </p>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="font-mono text-xs font-bold bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded border border-white/20">
                    1,800 BDT/hr
                  </span>
                </div>
              </div>
              <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                <p>FIFA standard 5-a-side artificial turf with floodlights and locker rooms.</p>
                <div className="flex justify-between border-t border-border/50 pt-2 text-[11px] font-medium text-foreground">
                  <span>Size: 60x40 ft (5v5)</span>
                  <span className="text-emerald-600 font-semibold">Members-Only Slots Available</span>
                </div>
              </CardContent>
            </Card>

            {/* Venue 2 */}
            <Card className="overflow-hidden border-border/80 group">
              <div className="relative h-48 w-full overflow-hidden bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800"
                  alt="Skyline Sports Ground"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-base font-bold">Skyline Sports Ground Banani</h3>
                  <p className="text-xs text-neutral-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    Block E, Kemal Ataturk Avenue, Banani, Dhaka
                  </p>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="font-mono text-xs font-bold bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded border border-white/20">
                    2,200 BDT/hr
                  </span>
                </div>
              </div>
              <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                <p>Premium rooftop turf venue overlooking the city skyline with safety netting.</p>
                <div className="flex justify-between border-t border-border/50 pt-2 text-[11px] font-medium text-foreground">
                  <span>Size: 75x45 ft (6v6)</span>
                  <span className="text-emerald-600 font-semibold">Premium Monofilament</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-secondary/30 py-8 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">TurfXI Bangladesh</span>
            <span>•</span>
            <span>The sports turf community network</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/turfs" className="hover:text-foreground">
              Turfs
            </Link>
            <Link href="/tournaments" className="hover:text-foreground">
              Tournaments
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-foreground font-semibold text-emerald-600">
              Join
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
