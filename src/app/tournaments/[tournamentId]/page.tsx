'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Coins,
  Shield,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Loader2,
  GitFork,
} from 'lucide-react';
import {
  useTournament,
  useGenerateBracket,
  useRegisterTournamentTeam,
} from '@/features/tournaments/tournaments.hooks';
import { useAuthStore } from '@/features/auth/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Pre-seeded teams for quick registration test
const USER_TEAMS = [
  { id: 'cmvkm8gd40004c0hlzxc5id49', name: 'Dhaka Thunder FC (Captain: Shihab)' },
  { id: 'cmvkm8h5z0007c0hly37jp9ld', name: 'Apex Strikers (Captain: Rahim)' },
];

export default function TournamentDetailPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = use(params);
  const { data: tournament, isLoading } = useTournament(tournamentId);
  const { user } = useAuthStore();

  const [selectedTeamId, setSelectedTeamId] = useState(USER_TEAMS[0]?.id || '');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { mutate: generateBracket, isPending: isGenerating } = useGenerateBracket(tournamentId);
  const { mutate: registerTeam, isPending: isRegistering } =
    useRegisterTournamentTeam(tournamentId);

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Tournament Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested tournament does not exist or has been removed.
        </p>
        <div className="mt-4">
          <Link
            href="/tournaments"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Back to Tournaments
          </Link>
        </div>
      </main>
    );
  }

  const isOrganizerOrAdmin =
    user?.role === 'ADMIN' ||
    user?.sub === tournament.organizerId ||
    user?.sub === tournament.hostTurf?.id;

  const isEligibleToJoin =
    user?.role === 'ADMIN' ||
    user?.role === 'TURF_OWNER' ||
    user?.membershipTier === 'SILVER' ||
    user?.membershipTier === 'GOLD';

  // Group bracket matches by round (Round 1, Round 2, Round 3...)
  const roundMap = new Map<number, typeof tournament.matches>();
  tournament.matches?.forEach((match) => {
    const list = roundMap.get(match.round) || [];
    list.push(match);
    roundMap.set(match.round, list);
  });
  const sortedRounds = Array.from(roundMap.keys()).sort((a, b) => a - b);

  const getRoundTitle = (round: number, totalRounds: number) => {
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semi-Finals';
    if (round === totalRounds - 2) return 'Quarter-Finals';
    return `Round ${round}`;
  };

  const handleRegisterTeam = () => {
    if (!selectedTeamId) return;
    registerTeam(selectedTeamId, {
      onSuccess: () => setIsRegisterOpen(false),
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Tournaments
        </Link>

        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <Share2 className="h-3.5 w-3.5" />
          Share Tournament
        </Button>
      </div>

      {/* Hero Banner Card */}
      <Card className="border-border/80 shadow-sm overflow-hidden bg-gradient-to-br from-card to-secondary/30">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant={tournament.status === 'IN_PROGRESS' ? 'default' : 'secondary'}
                className={
                  tournament.status === 'IN_PROGRESS'
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                    : ''
                }
              >
                {tournament.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Knockout Elimination
              </Badge>
            </div>

            {/* Actions for Captains & Organizers */}
            <div className="flex flex-wrap items-center gap-2">
              {isOrganizerOrAdmin && (
                <Button
                  onClick={() => generateBracket()}
                  disabled={isGenerating || (tournament.teamEntries?.length ?? 0) < 2}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-semibold"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <GitFork className="h-3.5 w-3.5" />
                  )}
                  {tournament.matches && tournament.matches.length > 0
                    ? 'Regenerate Bracket'
                    : 'Auto-Generate Bracket'}
                </Button>
              )}

              {tournament.status === 'UPCOMING' && (
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger>
                    <Button size="sm" className="gap-1.5 text-xs font-semibold" type="button">
                      <Users className="h-3.5 w-3.5" />
                      Register Squad
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Register Your Squad</DialogTitle>
                      <DialogDescription className="text-xs">
                        Select which team you captain to enter into {tournament.name}.
                      </DialogDescription>
                    </DialogHeader>

                    {!isEligibleToJoin ? (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-400">
                        <p className="font-semibold">Silver or Gold Membership Required</p>
                        <p className="mt-1">
                          Joining tournaments requires at least a Silver tier membership.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 py-2 text-left">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Select Your Team</Label>
                          <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            {USER_TEAMS.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="rounded-lg border border-border/80 bg-secondary/50 p-3 space-y-1.5 text-xs">
                          <div className="flex justify-between font-medium">
                            <span className="text-muted-foreground">Tournament Entry Fee:</span>
                            <span className="text-foreground">{tournament.entryFee} BDT</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Fee is deducted directly from your in-app wallet balance upon confirmation.
                          </p>
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRegisterOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={isRegistering || !isEligibleToJoin}
                        onClick={handleRegisterTeam}
                        className="gap-2"
                      >
                        {isRegistering ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          'Confirm & Pay Fee'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {tournament.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              <span>Organized by {tournament.organizer?.name || 'TurfXI Official'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {tournament.hostTurf?.name} ({tournament.hostTurf?.area}, {tournament.hostTurf?.city})
              </span>
            </p>
          </div>
        </CardHeader>

        {/* Quick Highlights Bar */}
        <CardContent className="border-t border-border/60 pt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-muted-foreground">Prize Pool</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                {tournament.prizeInfo || 'Trophy & Medals'}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground">Entry Fee</span>
              <p className="font-semibold text-foreground text-sm">
                {Number(tournament.entryFee) > 0 ? `${tournament.entryFee} BDT` : 'Free'}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground">Dates</span>
              <p className="font-semibold text-foreground text-sm">
                {new Date(tournament.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(tournament.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground">Registered Squads</span>
              <p className="font-semibold text-foreground text-sm">
                {tournament.teamEntries?.length ?? 0} Squads
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bracket Visualizer Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <GitFork className="h-4 w-4 text-emerald-600" />
              Tournament Knockout Bracket
            </h2>
            <p className="text-xs text-muted-foreground">
              Single-elimination tree generated based on seeding and schedule slots.
            </p>
          </div>

          {tournament.matches && tournament.matches.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {tournament.matches.length} Scheduled Matches
            </Badge>
          )}
        </div>

        {!tournament.matches || tournament.matches.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-border/80 p-8 text-center bg-card">
            <GitFork className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-sm font-semibold text-foreground">Bracket Not Generated Yet</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">
              The organizer will auto-generate single-elimination pairings once teams finish registering.
            </p>
            {isOrganizerOrAdmin && (
              <Button
                onClick={() => generateBracket()}
                disabled={isGenerating || (tournament.teamEntries?.length ?? 0) < 2}
                className="mt-4 gap-2 text-xs"
                size="sm"
              >
                {isGenerating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Auto-Generate Bracket Now
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-[700px] items-start gap-8 py-2">
              {sortedRounds.map((roundNum) => {
                const roundMatches = roundMap.get(roundNum) || [];
                const roundTitle = getRoundTitle(roundNum, sortedRounds.length);

                return (
                  <div key={roundNum} className="flex-1 space-y-4">
                    <div className="text-center">
                      <span className="inline-block rounded-md bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {roundTitle}
                      </span>
                    </div>

                    <div className="flex flex-col justify-around gap-6">
                      {roundMatches.map((m) => {
                        const matchDate = new Date(m.scheduledAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        const scoreA = m.match?.scoreA;
                        const scoreB = m.match?.scoreB;
                        const isPlayed = scoreA !== undefined && scoreA !== null && scoreB !== undefined && scoreB !== null;

                        return (
                          <div
                            key={m.id}
                            className="rounded-lg border border-border/80 bg-card p-3 shadow-sm hover:border-foreground/30 transition-all text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border/40 pb-1.5">
                              <span>Match #{m.id.slice(-4)}</span>
                              <span>{matchDate}</span>
                            </div>

                            {/* Team A */}
                            <div
                              className={`flex items-center justify-between rounded px-2 py-1.5 ${
                                isPlayed && scoreA! > scoreB!
                                  ? 'bg-emerald-500/10 font-bold text-emerald-700 dark:text-emerald-400'
                                  : 'text-foreground font-medium'
                              }`}
                            >
                              <span className="truncate">
                                {m.teamA?.name || 'TBD (Winner prior round)'}
                              </span>
                              <span className="ml-2 font-mono">{scoreA ?? '-'}</span>
                            </div>

                            {/* Team B */}
                            <div
                              className={`flex items-center justify-between rounded px-2 py-1.5 ${
                                isPlayed && scoreB! > scoreA!
                                  ? 'bg-emerald-500/10 font-bold text-emerald-700 dark:text-emerald-400'
                                  : 'text-foreground font-medium'
                              }`}
                            >
                              <span className="truncate">
                                {m.teamB?.name || 'TBD (Winner prior round)'}
                              </span>
                              <span className="ml-2 font-mono">{scoreB ?? '-'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Registered Squads Roster & Rules */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Teams List (2 cols) */}
        <Card className="md:col-span-2 border-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              Registered Squads ({tournament.teamEntries?.length ?? 0})
            </CardTitle>
            <CardDescription className="text-xs">
              Verified teams participating in this tournament.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!tournament.teamEntries || tournament.teamEntries.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No teams registered yet. Be the first squad to enter!
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {tournament.teamEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {entry.seed && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            #{entry.seed}
                          </span>
                        )}
                        <span className="font-semibold text-foreground">{entry.team.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Captain: {entry.team.captain?.name || 'Squad Leader'}
                      </p>
                    </div>

                    <Badge variant="outline" className="text-[10px]">
                      {entry.team._count?.members ?? 1} Players
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rules Card (1 col) */}
        <Card className="border-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Rules & Format
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <p className="leading-relaxed">
              {tournament.rules ||
                'Standard 5-a-side FIFA artificial turf rules apply. Direct knockout progression; draws decided by golden goal or penalty kicks.'}
            </p>
            <div className="border-t border-border/60 pt-3 space-y-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Fair play guidelines enforced</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Referees provided by host turf</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
