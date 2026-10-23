'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Target,
  Star,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Shield,
  Swords,
} from 'lucide-react';
import { useLeaderboard, useHeadToHead } from '@/features/matchStats/matchStats.hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Category = 'goals' | 'assists' | 'rating';

export default function LeaderboardPage() {
  const [category, setCategory] = useState<Category>('goals');
  const { data: players, isLoading } = useLeaderboard(category);

  // Head to Head demo between the two seeded Dhaka clubs
  const { data: h2h } = useHeadToHead(
    'cmvkmblf2000mukhl3ur6uq9v',
    'cmvkmblq2000nukhllu0k616t'
  );

  const top3 = players?.slice(0, 3) || [];
  const remaining = players?.slice(3) || [];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Banner */}
      <div className="border-b border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Trophy className="h-3.5 w-3.5" />
                Dhaka Turf Premier League Standings
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Player Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Official Dhaka turf athlete rankings based on certified match reports across Dhanmondi, Banani, and Uttara venues.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center p-1 rounded-lg bg-secondary/80 border border-border self-start md:self-end">
              <button
                type="button"
                onClick={() => setCategory('goals')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  category === 'goals'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                Top Goals
              </button>
              <button
                type="button"
                onClick={() => setCategory('assists')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  category === 'assists'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Target className="h-3.5 w-3.5 text-blue-500" />
                Playmakers
              </button>
              <button
                type="button"
                onClick={() => setCategory('rating')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  category === 'rating'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Star className="h-3.5 w-3.5 text-emerald-500" />
                Top Rating
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-64 rounded-xl bg-secondary/60 animate-pulse" />
            <div className="h-64 rounded-xl bg-secondary/60 animate-pulse" />
            <div className="h-64 rounded-xl bg-secondary/60 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Top 3 Podium Cards */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {/* Rank 2 (Silver) */}
                {top3[1] && (
                  <Card className="order-2 md:order-1 border-slate-300 dark:border-slate-700 bg-card/60 hover:border-slate-400 transition-colors">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xl font-black ring-2 ring-slate-400/30">
                        #2
                      </div>
                      <CardTitle className="text-base font-bold pt-2">{top3[1].name}</CardTitle>
                      <CardDescription className="text-xs">
                        {top3[1].teamName} • {top3[1].area}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pt-2 space-y-3">
                      <div className="rounded-lg bg-secondary/60 py-2">
                        <span className="text-2xl font-black font-mono text-foreground">
                          {category === 'goals'
                            ? `${top3[1].goals} Goals`
                            : category === 'assists'
                            ? `${top3[1].assists} Assists`
                            : `${top3[1].avgRating} Rating`}
                        </span>
                      </div>
                      <Link
                        href={`/players/${top3[1].playerId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        View Full Profile <ArrowRight className="h-3 w-3" />
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Rank 1 (Gold Champion) */}
                {top3[0] && (
                  <Card className="order-1 md:order-2 border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-card to-card ring-1 ring-amber-500/30 shadow-md">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-mono text-2xl font-black shadow-sm ring-4 ring-amber-500/20">
                        #1
                        <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-amber-500 fill-amber-500" />
                      </div>
                      <div className="pt-2">
                        <Badge className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider mb-1">
                          League Leader
                        </Badge>
                        <CardTitle className="text-lg font-extrabold">{top3[0].name}</CardTitle>
                        <CardDescription className="text-xs">
                          {top3[0].teamName} • {top3[0].area}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center pt-2 space-y-3">
                      <div className="rounded-lg bg-amber-500/15 border border-amber-500/20 py-2.5">
                        <span className="text-3xl font-black font-mono text-amber-700 dark:text-amber-400">
                          {category === 'goals'
                            ? `${top3[0].goals} Goals`
                            : category === 'assists'
                            ? `${top3[0].assists} Assists`
                            : `${top3[0].avgRating} Rating`}
                        </span>
                      </div>
                      <Link
                        href={`/players/${top3[0].playerId}`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 text-xs font-bold transition-colors shadow-xs"
                      >
                        View Champion Profile <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Rank 3 (Bronze) */}
                {top3[2] && (
                  <Card className="order-3 md:order-3 border-emerald-900/20 bg-card/60 hover:border-emerald-600/30 transition-colors">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950/10 text-emerald-800 dark:text-emerald-400 font-mono text-xl font-black ring-2 ring-emerald-600/20">
                        #3
                      </div>
                      <CardTitle className="text-base font-bold pt-2">{top3[2].name}</CardTitle>
                      <CardDescription className="text-xs">
                        {top3[2].teamName} • {top3[2].area}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pt-2 space-y-3">
                      <div className="rounded-lg bg-secondary/60 py-2">
                        <span className="text-2xl font-black font-mono text-foreground">
                          {category === 'goals'
                            ? `${top3[2].goals} Goals`
                            : category === 'assists'
                            ? `${top3[2].assists} Assists`
                            : `${top3[2].avgRating} Rating`}
                        </span>
                      </div>
                      <Link
                        href={`/players/${top3[2].playerId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        View Full Profile <ArrowRight className="h-3 w-3" />
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Remaining Ranks (4 - 10) Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Top Contenders (Ranks 4+)</h3>
                <span className="text-xs text-muted-foreground">{players?.length ?? 0} Ranked Athletes</span>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="divide-y divide-border">
                  {players && players.length > 0 ? (
                    players.map((player) => (
                      <Link
                        key={player.playerId}
                        href={`/players/${player.playerId}`}
                        className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-secondary/40 transition-colors group"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                              player.rank === 1
                                ? 'bg-amber-500 text-slate-950'
                                : player.rank === 2
                                ? 'bg-slate-300 dark:bg-slate-700 text-foreground'
                                : player.rank === 3
                                ? 'bg-emerald-600 text-white'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {player.rank}
                          </span>

                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-emerald-600 transition-colors">
                              {player.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {player.teamName} • {player.area} ({player.position})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                          <div className="text-right">
                            <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
                              {category === 'goals'
                                ? `${player.goals} G`
                                : category === 'assists'
                                ? `${player.assists} A`
                                : `${player.avgRating} ★`}
                            </span>
                            <span className="block text-[10px] text-muted-foreground">
                              {player.matchesPlayed} matches
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      No ranked players recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Squad Head to Head Matchup Engine */}
            {h2h && (
              <Card className="border-emerald-600/30 bg-gradient-to-r from-emerald-500/5 via-background to-secondary/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white">
                      <Swords className="h-4 w-4" />
                    </span>
                    <CardTitle className="text-base font-bold">
                      Dhaka Rivalry: Head-to-Head Win Probability
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">
                    Historical algorithm factoring career match statistics, goal differential, and verified fixtures.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-foreground">{h2h.teamA.name} ({h2h.teamA.winProbability}%)</span>
                    <span className="text-muted-foreground">{h2h.draws} Draws</span>
                    <span className="text-foreground">({h2h.teamB.winProbability}%) {h2h.teamB.name}</span>
                  </div>

                  {/* Dual Probability Bar */}
                  <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-500"
                      style={{ width: `${h2h.teamA.winProbability}%` }}
                    />
                    <div
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${h2h.teamB.winProbability}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-background/80 border border-border">
                      <span className="font-mono text-base font-bold text-emerald-600">{h2h.teamA.wins} Wins</span>
                      <span className="block text-[11px] text-muted-foreground">{h2h.teamA.goals} Goals Scored</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background/80 border border-border">
                      <span className="font-mono text-base font-bold text-amber-600">{h2h.teamB.wins} Wins</span>
                      <span className="block text-[11px] text-muted-foreground">{h2h.teamB.goals} Goals Scored</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
