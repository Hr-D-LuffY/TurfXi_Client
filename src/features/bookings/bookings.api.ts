import { apiClient } from '@/lib/apiClient';
import type {
  TurfAvailability,
  UserBooking,
  CreateBookingData,
} from './bookings.types';

export const bookingsApi = {
  getAvailability: async (turfId: string, date: string): Promise<TurfAvailability> => {
    const res = await apiClient.get<{ data: TurfAvailability }>(
      `/bookings/availability?turfId=${encodeURIComponent(
        turfId
      )}&date=${encodeURIComponent(date)}`
    );
    return res.data;
  },

  getMyBookings: async (): Promise<UserBooking[]> => {
    const res = await apiClient.get<{ data: UserBooking[] }>('/bookings/my');
    return res.data;
  },

  getById: async (id: string): Promise<UserBooking> => {
    const res = await apiClient.get<{ data: UserBooking }>(`/bookings/${id}`);
    return res.data;
  },

  create: async (data: CreateBookingData): Promise<UserBooking> => {
    const res = await apiClient.post<{ data: UserBooking }>('/bookings', data);
    return res.data;
  },

  cancel: async (id: string): Promise<UserBooking> => {
    const res = await apiClient.post<{ data: UserBooking }>(`/bookings/${id}/cancel`);
    return res.data;
  },
};
