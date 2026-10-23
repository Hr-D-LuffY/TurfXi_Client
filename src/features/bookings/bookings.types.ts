export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type BookingType = 'HOURLY' | 'FULL_DAY';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isMembersOnly: boolean;
  price: number;
  bookingId: string | null;
}

export interface TurfAvailability {
  turf: {
    id: string;
    name: string;
    area: string;
    city: string;
    pricePerHour: number;
    advancePercent: number;
  };
  date: string;
  slots: TimeSlot[];
}

export interface BookingTurfSummary {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  photos?: Array<{ id: string; url: string }>;
}

export interface UserBooking {
  id: string;
  turfId: string;
  bookerId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  type: BookingType;
  status: BookingStatus;
  totalPrice: number | string;
  advanceAmount: number | string;
  membersOnly: boolean;
  createdAt: string;
  turf: BookingTurfSummary;
  splitBilling?: {
    id: string;
    status: string;
  } | null;
}

export interface CreateBookingData {
  turfId: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  type?: BookingType;
}
