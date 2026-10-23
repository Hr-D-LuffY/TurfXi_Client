'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSubmitMatchReport } from '../matchStats.hooks';
import type { SubmitMatchReportData } from '../matchStats.types';
import { Plus, Trash2, Award, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  defaultPlayerId?: string;
  defaultPlayerName?: string;
  teamAId?: string;
  teamBId?: string;
  bookingId?: string;
  trigger?: React.ReactNode;
}

export function SubmitMatchReportDialog({
  defaultPlayerId,
  defaultPlayerName = 'Active Player',
  teamAId,
  teamBId,
  bookingId = 'cmvkma9b1000m54hl9018zrqb',
  trigger,
}: Props) {
  const [open, setOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitMatchReportData>({
    defaultValues: {
      bookingId,
      teamAId: teamAId || '',
      teamBId: teamBId || '',
      scoreA: 3,
      scoreB: 2,
      playerStats: [
        {
          playerId: defaultPlayerId || '',
          goals: 2,
          assists: 1,
          saves: 0,
          rating: 8.5,
          position: 'Forward',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'playerStats',
  });

  const { mutate: submitReport, isPending } = useSubmitMatchReport(() => {
    setOpen(false);
    reset();
  });

  const onSubmit = (data: SubmitMatchReportData) => {
    submitReport({
      ...data,
      scoreA: Number(data.scoreA),
      scoreB: Number(data.scoreB),
      playerStats: data.playerStats.map((p) => ({
        ...p,
        goals: Number(p.goals || 0),
        assists: Number(p.assists || 0),
        saves: Number(p.saves || 0),
        rating: Number(p.rating || 7.5),
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button size="sm" type="button" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
            <Award className="h-4 w-4" />
            Submit Match Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Award className="h-4 w-4" />
            </span>
            <DialogTitle className="text-lg font-bold">Official Match Report</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Verified match submission for Captains & Tournament Organizers. Updating scores automatically recalculates player ratings, streak form, and leaderboard standings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Match Reference & Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="bookingId" className="text-xs font-semibold">
                Match / Booking Reference ID
              </Label>
              <Input
                id="bookingId"
                {...register('bookingId', { required: 'Booking ID is required' })}
                placeholder="e.g. bkg_cmvkm8..."
                className="font-mono text-xs"
              />
              {errors.bookingId && (
                <p className="text-[11px] text-destructive">{errors.bookingId.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="scoreA" className="text-xs font-semibold">
                Squad A Score
              </Label>
              <Input
                id="scoreA"
                type="number"
                min="0"
                {...register('scoreA', { required: true, valueAsNumber: true })}
                className="text-base font-bold text-center"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="scoreB" className="text-xs font-semibold">
                Squad B Score
              </Label>
              <Input
                id="scoreB"
                type="number"
                min="0"
                {...register('scoreB', { required: true, valueAsNumber: true })}
                className="text-base font-bold text-center"
              />
            </div>
          </div>

          {/* Player Statistics Entry */}
          <div className="space-y-2 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground">Player Performance Logs</h4>
                <p className="text-[11px] text-muted-foreground">
                  Record individual goals, assists, saves, and match rating.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    playerId: '',
                    goals: 0,
                    assists: 0,
                    saves: 0,
                    rating: 7.0,
                    position: 'Midfielder',
                  })
                }
                className="h-7 text-xs gap-1 border-dashed"
              >
                <Plus className="h-3 w-3" />
                Add Player
              </Button>
            </div>

            <div className="space-y-2.5">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 rounded-lg border border-border/70 bg-secondary/30 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-muted-foreground">
                      Player #{index + 1} {index === 0 && defaultPlayerName ? `(${defaultPlayerName})` : ''}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="col-span-2 sm:col-span-4 space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Player User ID</Label>
                      <Input
                        {...register(`playerStats.${index}.playerId` as const, {
                          required: true,
                        })}
                        placeholder="Player User ID"
                        className="font-mono text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Goals</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(`playerStats.${index}.goals` as const, {
                          valueAsNumber: true,
                        })}
                        className="h-8 text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Assists</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(`playerStats.${index}.assists` as const, {
                          valueAsNumber: true,
                        })}
                        className="h-8 text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Saves</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(`playerStats.${index}.saves` as const, {
                          valueAsNumber: true,
                        })}
                        className="h-8 text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Rating (1-10)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        {...register(`playerStats.${index}.rating` as const, {
                          valueAsNumber: true,
                        })}
                        className="h-8 text-center font-semibold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="border-t border-border/60 pt-3 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Submit Report
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
