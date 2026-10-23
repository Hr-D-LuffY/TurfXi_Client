'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Coins,
  Plus,
  Search,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useTournaments, useCreateTournament } from '@/features/tournaments/tournaments.hooks';
import {
  createTournamentSchema,
  type CreateTournamentFormData,
} from '@/features/tournaments/tournaments.types';
import { useAuthStore } from '@/features/auth/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

// Pre-seeded verified venues for host selection
const HOST_VENUES = [
  { id: 'cmvkma8zm000f54hlsa7wbmdd', name: 'Apex Turf Arena Dhanmondi (Dhaka)' },
  { id: 'cmvkma8zm000g54hlsa7wbmdd', name: 'Skyline Sports Ground Banani (Dhaka)' },
];

export default function TournamentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAuthStore();
  const isOrganizerEligible =
    user?.role === 'ADMIN' || user?.role === 'TURF_OWNER' || user?.membershipTier === 'GOLD';

  const { data: tournaments, isLoading } = useTournaments({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    search: searchTerm || undefined,
  });

  const { mutate: createTournament, isPending: isCreating } = useCreateTournament(() => {
    setIsDialogOpen(false);
    reset();
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTournamentFormData>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: '',
      hostTurfId: HOST_VENUES[0]?.id || '',
      entryFee: 2500,
      prizeInfo: 'Winner: 20,000 BDT + Trophy, Runner-Up: 8,000 BDT',
      rules: '5-a-side knockout format. 20-minute halves.',
      startDate: '2026-11-20',
      endDate: '2026-11-25',
    },
  });

  const onSubmit = (data: CreateTournamentFormData) => {
    createTournament(data);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Trophy className="h-3.5 w-3.5" />
              Competitive Leagues
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Tournaments & Cups
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Register your squad, compete in single-elimination brackets, and track rankings across Dhaka.
          </p>
        </div>

        <div>
          {isOrganizerEligible ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <Button className="gap-2 shadow-sm" type="button">
                  <Plus className="h-4 w-4" />
                  Organize Tournament
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Host a New Tournament</DialogTitle>
                  <DialogDescription className="text-sm">
                    Set up prizes, tournament format, and venue dates. Accessible to Gold Members & Turf Owners.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                  <div className="space-y-1 text-left">
                    <Label htmlFor="t-name" className="text-xs font-medium">
                      Tournament Title
                    </Label>
                    <Input
                      id="t-name"
                      placeholder="e.g. Dhanmondi Winter Super Cup"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1 text-left">
                    <Label htmlFor="t-host" className="text-xs font-medium">
                      Host Turf Venue
                    </Label>
                    <select
                      id="t-host"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      {...register('hostTurfId')}
                    >
                      {HOST_VENUES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1 text-left">
                      <Label htmlFor="t-fee" className="text-xs font-medium">
                        Entry Fee per Team (BDT)
                      </Label>
                      <Input
                        id="t-fee"
                        type="number"
                        placeholder="2500"
                        {...register('entryFee', { valueAsNumber: true })}
                      />
                      {errors.entryFee && (
                        <p className="text-xs text-destructive">{errors.entryFee.message}</p>
                      )}
                    </div>

                    <div className="space-y-1 text-left">
                      <Label htmlFor="t-prize" className="text-xs font-medium">
                        Prize Breakdown
                      </Label>
                      <Input
                        id="t-prize"
                        placeholder="e.g. 20,000 BDT + Trophy"
                        {...register('prizeInfo')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1 text-left">
                      <Label htmlFor="t-start" className="text-xs font-medium">
                        Start Date
                      </Label>
                      <Input id="t-start" type="date" {...register('startDate')} />
                    </div>

                    <div className="space-y-1 text-left">
                      <Label htmlFor="t-end" className="text-xs font-medium">
                        End Date
                      </Label>
                      <Input id="t-end" type="date" {...register('endDate')} />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <Label htmlFor="t-rules" className="text-xs font-medium">
                      Format & Rules
                    </Label>
                    <Input
                      id="t-rules"
                      placeholder="e.g. 5-a-side, 20m halves, knockout rules"
                      {...register('rules')}
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating} className="gap-2">
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        'Publish Tournament'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Gold Tier or Turf Owner unlocks tournament hosting</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tournaments by name..."
            className="pl-9 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'UPCOMING', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {status === 'ALL' ? 'All Tournaments' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !tournaments || tournaments.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border/80 p-8 text-center">
            <Trophy className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No tournaments found</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              No active or upcoming tournaments match your criteria. Check back soon or host one if eligible!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((t) => {
              const startDateFormatted = new Date(t.startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <Card
                  key={t.id}
                  className="flex flex-col justify-between overflow-hidden border-border/80 transition-all hover:border-foreground/30 hover:shadow-md"
                >
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant={
                          t.status === 'IN_PROGRESS'
                            ? 'default'
                            : t.status === 'UPCOMING'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={`text-xs font-medium ${
                          t.status === 'IN_PROGRESS'
                            ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                            : ''
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </Badge>

                      {t.prizeInfo && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          <Trophy className="h-3 w-3" />
                          Prize Pool
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-1">
                      {t.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-4 text-xs text-muted-foreground">
                    {t.hostTurf && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="line-clamp-1">{t.hostTurf.name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>Starts {startDateFormatted}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Coins className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>{Number(t.entryFee) > 0 ? `${t.entryFee} BDT / team` : 'Free Entry'}</span>
                      </div>

                      <div className="flex items-center gap-1 font-medium text-muted-foreground">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        <span>{t._count?.teamEntries ?? 0} Squads</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-border/40 pt-3">
                    <Link
                      href={`/tournaments/${t.id}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      View Bracket & Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
