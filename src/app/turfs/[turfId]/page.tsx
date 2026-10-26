'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  Shield,
  Sparkles,
  Lock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Coins,
  ChevronRight,
  Info,
  Car,
  Lightbulb,
  ShowerHead,
  AlertCircle,
  Loader2,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useTurf } from '@/features/turfs/turfs.hooks';
import { useTurfAvailability, useCreateBooking } from '@/features/bookings/bookings.hooks';
import type { TimeSlot } from '@/features/bookings/bookings.types';
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
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ turfId: string }>;
}

export default function TurfDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const turfId = resolvedParams.turfId;
  const router = useRouter();

  const { data: turf, isLoading: turfLoading, error: turfError } = useTurf(turfId);
  const { user } = useAuthStore();

  // Date selection state — default to today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'BKASH'>('WALLET');

  const { data: availability, isLoading: availLoading } = useTurfAvailability(
    turfId,
    selectedDate
  );

  const { mutate: createBooking, isPending: isBooking } = useCreateBooking((booking) => {
    setIsConfirmOpen(false);
    router.push('/bookings');
  });

  // Generate next 4 quick date chips
  const quickDates = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const label =
      i === 0
        ? 'Today'
        : i === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    return { iso, label };
  });

  if (turfLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-64 rounded-xl bg-secondary/60" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 rounded-xl bg-secondary/60" />
            <div className="h-96 rounded-xl bg-secondary/60" />
          </div>
        </div>
      </div>
    );
  }

  if (turfError || !turf) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Turf Venue Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested turf ground does not exist or may have been deactivated.
        </p>
        <div className="mt-6">
          <Link
            href="/turfs"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Explore Available Turfs
          </Link>
        </div>
      </div>
    );
  }

  const pricePerHour = Number(turf.pricePerHour);
  const advancePercent = turf.advancePercent || 30;
  const advanceAmount = Math.round((pricePerHour * advancePercent) / 100);
  const venueBalance = pricePerHour - advanceAmount;

  const isUserEligibleForSlot = (slot: TimeSlot) => {
    if (!slot.isMembersOnly) return true;
    if (!user) return false;
    return (
      user.role === 'ADMIN' ||
      user.role === 'TURF_OWNER' ||
      user.membershipTier === 'SILVER' ||
      user.membershipTier === 'GOLD'
    );
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.isBooked) return;
    if (slot.isMembersOnly && !isUserEligibleForSlot(slot)) {
      toast.error('This is a Prime Members-Only slot reserved for Silver and Gold athletes.');
      return;
    }
    setSelectedSlot(slot);
  };

  const handleConfirmReservation = () => {
    if (!selectedSlot) return;
    createBooking({
      turfId,
      bookingDate: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      type: 'HOURLY',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Turf Hero Header */}
      <div className="border-b border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/turfs" className="hover:text-foreground">Turfs</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground truncate max-w-[200px]">{turf.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {turf.name}
                </h1>
                {turf.verified && (
                  <Badge className="bg-emerald-600 text-white text-[11px] font-semibold gap-1">
                    <Shield className="h-3 w-3" />
                    Verified Venue
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {turf.address}, {turf.area}, {turf.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Open 06:00 AM – 12:00 AM Daily
                </span>
              </div>
            </div>

            {/* Price Pill */}
            <div className="flex items-center gap-3 self-start md:self-center p-3 rounded-xl border border-border bg-card shadow-xs">
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  ৳{pricePerHour.toLocaleString()}
                </span>
                <span className="block text-[11px] text-muted-foreground">per 60-min match slot</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
        {/* Pitch Specification Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Pitch Size</span>
            <p className="text-sm font-bold text-foreground">{turf.size || '7v7 & 8v8 Standard'}</p>
          </div>
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Surface Grade</span>
            <p className="text-sm font-bold text-foreground">{turf.surfaceType || '4G FIFA AstroTurf'}</p>
          </div>
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Advance Deposit</span>
            <p className="text-sm font-bold text-foreground">{advancePercent}% Instant Deposit</p>
          </div>
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Cancellation Window</span>
            <p className="text-sm font-bold text-foreground">Up to 6 hrs before kickoff</p>
          </div>
        </div>

        {/* Interactive Booking & Slot Picker Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Date & Slot Selector */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">1. Select Match Date</h3>
                  <p className="text-xs text-muted-foreground">
                    Available slots update instantly based on verified reservations.
                  </p>
                </div>
                {/* Date Input for further dates */}
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Quick Date Chips */}
              <div className="flex flex-wrap gap-2">
                {quickDates.map((q) => (
                  <button
                    key={q.iso}
                    type="button"
                    onClick={() => {
                      setSelectedDate(q.iso);
                      setSelectedSlot(null);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      selectedDate === q.iso
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">2. Choose Match Time Slot</h3>
                  <p className="text-xs text-muted-foreground">
                    60-minute match intervals with automatic floodlight coordination.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Prime Slot
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                    Booked
                  </span>
                </div>
              </div>

              {availLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="h-14 rounded-lg bg-secondary/60 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availability?.slots.map((slot) => {
                    const isSelected =
                      selectedSlot?.startTime === slot.startTime &&
                      selectedSlot?.endTime === slot.endTime;
                    const isLocked = slot.isMembersOnly && !isUserEligibleForSlot(slot);

                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-3 rounded-lg border text-left transition-all relative ${
                          slot.isBooked
                            ? 'border-border/50 bg-secondary/30 opacity-40 cursor-not-allowed line-through'
                            : isSelected
                            ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                            : slot.isMembersOnly
                            ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60'
                            : 'border-border bg-card hover:border-foreground/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {slot.isBooked ? (
                            <span className="text-[9px] font-bold uppercase text-muted-foreground">
                              Booked
                            </span>
                          ) : isSelected ? (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          ) : slot.isMembersOnly ? (
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          ) : null}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ৳{slot.price}
                          </span>
                          {slot.isMembersOnly && (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              Silver / Gold
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Venue Amenities */}
            <div className="border-t border-border/60 pt-6 space-y-3">
              <h3 className="text-base font-bold text-foreground">Venue Amenities & Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border">
                  <Lightbulb className="h-4 w-4 text-emerald-600" />
                  <span>High-Lux LED Floodlights</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border">
                  <ShowerHead className="h-4 w-4 text-emerald-600" />
                  <span>Changing Rooms & Showers</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border">
                  <Car className="h-4 w-4 text-emerald-600" />
                  <span>Secure Parking Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Summary Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold">Booking Summary</CardTitle>
                <CardDescription className="text-xs">
                  Review selected slot details before confirming.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {selectedSlot ? (
                  <>
                    <div className="space-y-2 rounded-lg bg-secondary/40 p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-semibold text-foreground">
                          {new Date(selectedDate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Time Slot</span>
                        <span className="font-mono font-bold text-foreground">
                          {selectedSlot.startTime} – {selectedSlot.endTime} (60 min)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Slot Type</span>
                        <span className="font-semibold text-foreground">
                          {selectedSlot.isMembersOnly ? 'Prime Members Slot' : 'Standard Booking'}
                        </span>
                      </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-2 text-xs border-t border-border/60 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Pitch Fee</span>
                        <span className="font-mono font-bold text-foreground">৳{pricePerHour}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Advance Deposit ({advancePercent}%)</span>
                        <span className="font-mono">৳{advanceAmount}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Due at Turf Counter</span>
                        <span className="font-mono">৳{venueBalance}</span>
                      </div>
                    </div>

                    <div className="border-t border-border/60 pt-3 space-y-2">
                      {user ? (
                        <Button
                          type="button"
                          onClick={() => setIsConfirmOpen(true)}
                          className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Reserve Slot (Pay ৳{advanceAmount} Deposit)
                        </Button>
                      ) : (
                        <Link
                          href={`/login?redirect=/turfs/${turfId}`}
                          className="flex items-center justify-center w-full rounded-md bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                        >
                          Sign In to Reserve Slot
                        </Link>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground/60" />
                    <p className="text-xs font-medium text-foreground">No Slot Selected</p>
                    <p className="text-[11px] text-muted-foreground max-w-[200px] mx-auto">
                      Click an available green or amber slot on the left to review price and reserve.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation & Payment Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <DialogTitle className="text-lg font-bold">Confirm Turf Reservation</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              You are locking this slot at {turf.name}. Advance deposit secures your reservation instantly.
            </DialogDescription>
          </DialogHeader>

          {selectedSlot && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="rounded-lg bg-secondary/50 p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ground:</span>
                  <span className="font-bold text-foreground">{turf.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold text-foreground">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-mono font-bold text-foreground">
                    {selectedSlot.startTime} – {selectedSlot.endTime}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-1 font-bold">
                  <span className="text-foreground">Instant Deposit Due:</span>
                  <span className="text-emerald-600 font-mono text-sm">৳{advanceAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Select Deposit Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      paymentMethod === 'WALLET'
                        ? 'border-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-500'
                        : 'border-border bg-card'
                    }`}
                  >
                    <span className="block font-bold text-foreground">TurfXI Wallet</span>
                    <span className="text-[10px] text-muted-foreground">Instant deduction</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BKASH')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      paymentMethod === 'BKASH'
                        ? 'border-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-500'
                        : 'border-border bg-card'
                    }`}
                  >
                    <span className="block font-bold text-foreground">bKash / Nagad</span>
                    <span className="text-[10px] text-muted-foreground">Mobile Banking</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isBooking}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmReservation}
              disabled={isBooking}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {isBooking ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Securing Slot...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Confirm & Reserve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
