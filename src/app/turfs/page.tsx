'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  Sparkles,
  ShieldCheck,
  Clock,
  Layers,
  ArrowRight,
  Loader2,
  CalendarCheck,
} from 'lucide-react';
import { useTurfs } from '@/features/turfs/turfs.hooks';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AREAS = ['All Dhaka', 'Dhanmondi', 'Banani', 'Gulshan', 'Uttara', 'Mirpur'];

export default function TurfsPage() {
  const [selectedArea, setSelectedArea] = useState('All Dhaka');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: turfs, isLoading } = useTurfs({
    area: selectedArea === 'All Dhaka' ? undefined : selectedArea,
    search: searchQuery || undefined,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Pitches
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Find Sports Turfs in Dhaka
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            FIFA-standard artificial grass, floodlights, locker rooms, and instant slot reservations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/missing-players"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Find Open Match Slots
          </Link>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venue name, area, or surface..."
            className="pl-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedArea === area
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Turfs Grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !turfs || turfs.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border/80 p-8 text-center bg-card">
            <MapPin className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No turf pitches found</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              We couldn&apos;t find any verified turfs matching your filters. Try selecting a different area or clearing your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {turfs.map((turf) => {
              const photoUrl =
                turf.photos?.[0]?.url ||
                'https://images.unsplash.com/photo-1529900240041-22f114d18e40?w=800';

              return (
                <Card
                  key={turf.id}
                  className="flex flex-col justify-between overflow-hidden border-border/80 transition-all hover:border-foreground/30 hover:shadow-md group"
                >
                  {/* Photo Banner with Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={turf.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{turf.area}, {turf.city}</span>
                      </div>

                      <span className="font-mono text-sm font-bold bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20">
                        {turf.pricePerHour} BDT<span className="text-[10px] font-normal text-neutral-300">/hr</span>
                      </span>
                    </div>

                    {turf.verified && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-emerald-600/90 text-white border-0 text-[10px] font-semibold gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Verified Venue
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="space-y-1.5 pb-2">
                    <CardTitle className="text-base font-bold tracking-tight text-foreground line-clamp-1">
                      {turf.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {turf.description || 'Modern synthetic sports turf with professional lighting and equipment.'}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-2.5 pb-3 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between border-t border-border/50 pt-2.5">
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{turf.size || '5-a-side'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{turf.surfaceType || 'AstroTurf'}</span>
                      </div>
                    </div>

                    {turf.membersOnlySlots && turf.membersOnlySlots.length > 0 && (
                      <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 p-2 text-[11px] text-foreground">
                        <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">
                          Members-Only Early Slots ({turf.membersOnlySlots[0]?.startTime} - {turf.membersOnlySlots[0]?.endTime})
                        </span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t border-border/40 pt-3">
                    <Link
                      href={`/turfs/${turf.id}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <CalendarCheck className="h-3.5 w-3.5" />
                      Book Match Slot
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
