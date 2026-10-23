export interface TurfPhoto {
  id: string;
  turfId: string;
  url: string;
}

export interface MembersOnlySlot {
  id: string;
  turfId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Turf {
  id: string;
  ownerId: string;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  pricePerHour: string | number;
  size?: string | null;
  surfaceType?: string | null;
  advancePercent: number;
  verified: boolean;
  createdAt: string;
  photos?: TurfPhoto[];
  membersOnlySlots?: MembersOnlySlot[];
}
