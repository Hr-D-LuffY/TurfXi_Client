'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Shield,
  Coins,
  Share2,
} from 'lucide-react';
import { useMyBookings, useCancelBooking } from '@/features/bookings/bookings.hooks';
import { useAuthStore } from '@/features/auth/auth.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function MyBookingsPage() {
  const { user } = useAuthStore();
  const { data: bookings, isLoading, error } = useMyBookings();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking(() => {
    setCancellingBookingId(null);
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-md px-4 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Calendar className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Sign In to View Bookings</h2>
          <p className="text-xs text-muted-foreground">
            You must be signed in with your player or team manager account to see your turf reservations and split-bill receipts.
          </p>
          <div className="pt-2">
            <Link
              href="/login?redirect=/bookings"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings?.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Banner */}
      <div className="border-b border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Calendar className="h-3.5 w-3.5" />
                Player Turf Schedule
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                My Bookings & Reservations
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your confirmed turf slots, review advance deposits, and coordinate with teammates.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center p-1 rounded-lg bg-secondary border border-border self-start md:self-end">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Bookings
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CONFIRMED')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === 'CONFIRMED'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Confirmed
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CANCELLED')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === 'CANCELLED'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-36 rounded-xl bg-secondary/60 animate-pulse" />
            <div className="h-36 rounded-xl bg-secondary/60 animate-pulse" />
          </div>
        ) : filteredBookings && filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isConfirmed = b.status === 'CONFIRMED';
              const isCancelled = b.status === 'CANCELLED';

              return (
                <Card
                  key={b.id}
                  className={`overflow-hidden transition-all ${
                    isCancelled ? 'opacity-60 border-border/50 bg-secondary/20' : 'border-border bg-card shadow-xs'
                  }`}
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Venue & Timing */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/turfs/${b.turfId}`}
                          className="text-base font-bold text-foreground hover:text-emerald-600 transition-colors"
                        >
                          {b.turf.name}
                        </Link>
                        {isConfirmed && (
                          <Badge className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                            Confirmed
                          </Badge>
                        )}
                        {isCancelled && (
                          <Badge variant="destructive" className="text-[10px] font-bold uppercase tracking-wider">
                            Cancelled
                          </Badge>
                        )}
                        {b.membersOnly && (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                            Prime Slot
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                          {b.turf.area}, {b.turf.city}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(b.bookingDate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          at {b.startTime} – {b.endTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground">
                        Reservation Ref:{' '}
                        <span className="font-mono text-foreground font-semibold">{b.id}</span>
                      </p>
                    </div>

                    {/* Right: Payment Breakdown & Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="font-mono text-base font-extrabold text-foreground">
                          ৳{Number(b.totalPrice).toLocaleString()}
                        </span>
                        <span className="block text-[11px] text-emerald-600 font-semibold">
                          Advance Paid: ৳{Number(b.advanceAmount).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/turfs/${b.turfId}`}
                          className="inline-flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors border border-border"
                        >
                          Venue Info
                        </Link>

                        {isConfirmed && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCancellingBookingId(b.id)}
                            className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 rounded-xl border border-dashed border-border bg-card/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No Bookings Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You have no turf slots reserved under this filter. Browse premier Dhaka turfs in Dhanmondi, Banani, or Uttara to book your next match.
              </p>
            </div>
            <Link
              href="/turfs"
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs shadow-xs transition-colors"
            >
              Browse Turfs Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Dialog
        open={Boolean(cancellingBookingId)}
        onOpenChange={(open) => !open && setCancellingBookingId(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <DialogTitle className="text-base font-bold">Cancel Reservation</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to cancel this booking? Advance deposit refund will be processed to your TurfXI wallet according to the venue cancellation policy.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCancellingBookingId(null)}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => cancellingBookingId && cancelBooking(cancellingBookingId)}
              disabled={isCancelling}
              className="gap-1.5"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Confirm Cancellation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
