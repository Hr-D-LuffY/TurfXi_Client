'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingsApi } from './bookings.api';
import type { CreateBookingData, UserBooking } from './bookings.types';

export const BOOKING_KEYS = {
  all: ['bookings'] as const,
  availability: (turfId: string, date: string) =>
    [...BOOKING_KEYS.all, 'availability', turfId, date] as const,
  my: () => [...BOOKING_KEYS.all, 'my'] as const,
  detail: (id: string) => [...BOOKING_KEYS.all, 'detail', id] as const,
};

export function useTurfAvailability(turfId: string, date: string) {
  return useQuery({
    queryKey: BOOKING_KEYS.availability(turfId, date),
    queryFn: () => bookingsApi.getAvailability(turfId, date),
    enabled: Boolean(turfId && date),
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: BOOKING_KEYS.my(),
    queryFn: () => bookingsApi.getMyBookings(),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: BOOKING_KEYS.detail(id),
    queryFn: () => bookingsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateBooking(onSuccess?: (booking: UserBooking) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingData) => bookingsApi.create(data),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
      toast.success('Turf slot reserved successfully!');
      if (onSuccess) onSuccess(booking);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to reserve turf slot.');
    },
  });
}

export function useCancelBooking(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
      toast.success('Booking cancelled successfully.');
      if (onSuccess) onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to cancel booking.');
    },
  });
}
