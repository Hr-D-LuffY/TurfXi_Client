'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Shield,
  MapPin,
  Calendar,
  Sparkles,
  Lock,
  Flame,
  Target,
  ArrowUpRight,
  TrendingUp,
  Share2,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { usePlayerStats } from '@/features/matchStats/matchStats.hooks';
import { useAuthStore } from '@/features/auth/auth.store';
import { SubmitMatchReportDialog } from '@/features/matchStats/components/SubmitMatchReportDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ playerId: string }>;
}

export default function PlayerProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const playerId = resolvedParams.playerId;
  const { data: player, isLoading, error } = usePlayerStats(playerId);
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const isOwnProfile = user?.sub === playerId;
  const isCaptainOrAdmin =
    user?.role === 'ADMIN' ||
    (player?.team && (player.team.captainId === user?.sub || player.team.viceCaptainId === user?.sub));

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Profile URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-48 rounded-xl bg-secondary/60" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-28 rounded-lg bg-secondary/60" />
            <div className="h-28 rounded-lg bg-secondary/60" />
            <div className="h-28 rounded-lg bg-secondary/60" />
            <div className="h-28 rounded-lg bg-secondary/60" />
          </div>
          <div className="h-64 rounded-xl bg-secondary/60" />
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Player Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The player profile you are looking for does not exist or has been removed.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
          >
            Dhaka Leaderboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  const profile = player.playerProfile;
  const initials = player.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const isGold = player.membershipTier === 'GOLD';
  const isSilver = player.membershipTier === 'SILVER';

  return (
    <div className="min-h-screen bg-background">
      {/* Pitch subtle pattern backdrop */}
      <div className="relative border-b border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Player Identity */}
            <div className="flex items-start sm:items-center gap-4">
              <div
                className={`relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl font-mono text-2xl sm:text-3xl font-black text-white shadow-md ${
                  isGold
                    ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 ring-4 ring-amber-500/20'
                    : isSilver
                    ? 'bg-gradient-to-tr from-slate-700 via-slate-600 to-slate-400 ring-4 ring-slate-400/20'
                    : 'bg-emerald-700 ring-2 ring-emerald-500/20'
                }`}
              >
                {initials}
                {isGold && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {player.name}
                  </h1>
                  {isGold ? (
                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Gold Member
                    </Badge>
                  ) : isSilver ? (
                    <Badge className="bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 text-xs font-bold uppercase tracking-wider">
                      Silver Member
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
                      Free Member
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground">
                  {player.team ? (
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Shield className="h-3.5 w-3.5 text-emerald-600" />
                      {player.team.name}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      Free Agent
                    </span>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {profile?.area || 'Dhanmondi'}, {profile?.city || 'Dhaka'}
                  </span>
                </div>

                {/* Player Traits */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Position: {profile?.position || 'Forward'}
                  </Badge>
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Foot: {profile?.preferredFoot || 'Right'}
                  </Badge>
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Skill: {profile?.skillLevel || 'Advanced'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 text-xs font-medium"
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Share'}
              </Button>

              {isCaptainOrAdmin && (
                <SubmitMatchReportDialog
                  defaultPlayerId={player.id}
                  defaultPlayerName={player.name}
                  teamAId={player.team?.id}
                />
              )}

              {isOwnProfile && player.membershipTier === 'FREE' && (
                <Link
                  href="/wallet"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-3 py-1.5 text-xs transition-colors shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Upgrade to Gold
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
        {/* If Tier Gated (Free Tier) */}
        {player.tierGated ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">Matches Played</CardDescription>
                  <CardTitle className="text-2xl font-bold font-mono">{player.matchesPlayed}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-[11px] text-muted-foreground">Verified Dhaka turf matches</span>
                </CardContent>
              </Card>

              {/* Blurred preview cards */}
              <Card className="relative overflow-hidden opacity-75">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">Career Goals</CardDescription>
                  <CardTitle className="text-2xl font-bold font-mono blur-sm select-none">
                    {player.previewStats?.goals ?? 3}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3 text-amber-500" /> Locked (Silver+)
                  </span>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden opacity-75">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">Career Assists</CardDescription>
                  <CardTitle className="text-2xl font-bold font-mono blur-sm select-none">
                    {player.previewStats?.assists ?? 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3 text-amber-500" /> Locked (Silver+)
                  </span>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden opacity-75">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">Average Rating</CardDescription>
                  <CardTitle className="text-2xl font-bold font-mono blur-sm select-none">
                    {player.previewStats?.avgRating ?? 8.5}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3 text-amber-500" /> Locked (Silver+)
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Tier Gate Pitch Card */}
            <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-background to-secondary/30">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Lock className="h-4 w-4" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">
                        Unlock Verified Career Analytics & Badges
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Detailed career analytics, match rating histories, win streak badges, and Dhaka leaderboard rankings require a <strong>Silver</strong> or <strong>Gold</strong> membership.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/80 pt-2">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Complete match-by-match log
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Unlock Sharpshooter & Playmaker badges
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Form streak tracker (W/D/L)
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Dhaka city rankings & predictions
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col w-full sm:w-auto gap-2.5 shrink-0">
                    <Link
                      href="/wallet"
                      className="inline-flex items-center justify-center rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 text-xs transition-colors shadow-xs"
                    >
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      Get Gold Membership (৳599/mo)
                    </Link>
                    <Link
                      href="/wallet"
                      className="inline-flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-4 py-2 text-xs transition-colors border border-border"
                    >
                      Get Silver Membership (৳299/mo)
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Unlocked Full Stats View (Silver / Gold) */
          <div className="space-y-8">
            {/* Core KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-1.5">
                  <CardDescription className="text-xs font-medium">Matches Played</CardDescription>
                  <CardTitle className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
                    {player.stats?.matchesPlayed ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    {player.stats?.winRate ?? 0}% Win Rate ({player.stats?.wins ?? 0} W)
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1.5">
                  <CardDescription className="text-xs font-medium">Goals Scored</CardDescription>
                  <CardTitle className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
                    {player.stats?.goals ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-[11px] text-muted-foreground">
                    {(player.stats && player.stats.matchesPlayed > 0
                      ? (player.stats.goals / player.stats.matchesPlayed).toFixed(1)
                      : '0.0')}{' '}
                    goals per match
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1.5">
                  <CardDescription className="text-xs font-medium">Assists Created</CardDescription>
                  <CardTitle className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
                    {player.stats?.assists ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-[11px] text-muted-foreground">
                    {player.stats?.saves ?? 0} goalkeeper saves
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1.5">
                  <CardDescription className="text-xs font-medium">Average Rating</CardDescription>
                  <CardTitle className="text-3xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                    {player.stats?.avgRating ?? 7.0}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Scale 1.0 – 10.0 (Elite Form)
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Recent Form Streak */}
            {player.stats?.form && player.stats.form.length > 0 && (
              <Card>
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Recent Match Form Streak
                    </h3>
                    <p className="text-xs text-foreground/80">
                      Performance outcome across recent competitive turf fixtures.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {player.stats.form.map((result, idx) => (
                      <span
                        key={idx}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-black shadow-xs ${
                          result === 'W'
                            ? 'bg-emerald-600 text-white'
                            : result === 'D'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gold Exclusive Analytics & Predictions */}
            {player.goldInsights && (
              <Card className="border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500 text-slate-950">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <CardTitle className="text-base font-bold">
                        Gold Performance Radar & Dhaka City Rank
                      </CardTitle>
                    </div>
                    <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                      Gold Exclusive
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">
                    Deep analytics benchmarked across all registered turf athletes in Dhaka.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-0">
                  <div className="p-4 rounded-lg bg-background/80 border border-amber-500/20 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Percentile Rating
                    </span>
                    <p className="text-2xl font-bold font-mono text-foreground">
                      Top {100 - player.goldInsights.percentileRating}%
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Outperforming {player.goldInsights.percentileRating}% of Dhaka forwards
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-background/80 border border-amber-500/20 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      City Leaderboard Rank
                    </span>
                    <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                      #{player.goldInsights.cityRank} in Dhaka
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Dhanmondi / Banani competitive circuit
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-background/80 border border-amber-500/20 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Win Prediction Power
                    </span>
                    <p className="text-2xl font-bold font-mono text-emerald-600">
                      {player.goldInsights.headToHeadPredictionPower} Impact
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      High match impact index when on starting roster
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievement Badges */}
            {player.badges && player.badges.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Earned Career Badges</h3>
                    <p className="text-xs text-muted-foreground">
                      Verified tournament and friendly match milestones.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {player.badges.length} Badges
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {player.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card shadow-xs transition-colors hover:border-foreground/30"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-xs ${
                          badge.tier === 'GOLD'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : badge.tier === 'SILVER'
                            ? 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                            : 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                        }`}
                      >
                        {badge.id === 'sharpshooter' ? (
                          <Flame className="h-5 w-5" />
                        ) : badge.id === 'playmaker' ? (
                          <Target className="h-5 w-5" />
                        ) : badge.id === 'perfectionist' ? (
                          <Sparkles className="h-5 w-5" />
                        ) : (
                          <Award className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-foreground truncate">{badge.name}</h4>
                          <span className="text-[9px] font-bold uppercase text-muted-foreground">
                            {badge.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Match History Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Verified Match History</h3>
                  <p className="text-xs text-muted-foreground">
                    Recent fixtures recorded by certified turf officials.
                  </p>
                </div>
              </div>

              {player.matchHistory && player.matchHistory.length > 0 ? (
                <div className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
                  {player.matchHistory.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {new Date(match.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {match.venue}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 pt-0.5">
                          <span className="text-sm font-bold text-foreground">
                            {match.teamA}
                          </span>
                          <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-black text-foreground">
                            {match.scoreA ?? 0} - {match.scoreB ?? 0}
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {match.teamB}
                          </span>
                        </div>
                      </div>

                      {/* Personal Contributions */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {match.personalGoals > 0 && (
                          <Badge className="bg-emerald-600 text-white text-[11px] font-semibold">
                            +{match.personalGoals} Goals
                          </Badge>
                        )}
                        {match.personalAssists > 0 && (
                          <Badge variant="secondary" className="text-[11px] font-semibold">
                            +{match.personalAssists} Assists
                          </Badge>
                        )}
                        {match.personalRating && (
                          <Badge variant="outline" className="font-mono text-[11px] font-bold">
                            {match.personalRating} Rating
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-lg border border-dashed border-border bg-card/50">
                  <p className="text-xs text-muted-foreground">No matches recorded for this player yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
