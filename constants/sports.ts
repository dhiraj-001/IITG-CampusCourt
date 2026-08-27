import { Facility, Sport, SportId, TimeSlot } from '../store/bookingStore';

// ─── Sports catalogue ─────────────────────────────────────────────────────────

export const SPORTS: Sport[] = [
  { id: 'gym', label: 'Gymnasium', emoji: '🏋️' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'badminton', label: 'Badminton', emoji: '🏸' },
  { id: 'football', label: 'Football', emoji: '⚽' },
  { id: 'cricket', label: 'Cricket', emoji: '🏏' },
];

// ─── Facility catalogue (mock — replace with API) ─────────────────────────────

export const FACILITIES: Facility[] = [
  {
    id: 'fac-iitg-gym',
    name: 'Campus Gymnasium',
    address: 'New SAC Building, IITG',
    sport: 'gym',
    rating: 4.8,
    distance: '0.2 km',
    pricePerSlot: 0,
    availableSlots: 15,
    totalSlots: 40,
    imageGradient: ['#F59E0B', '#F43F5E'],
  },
  {
    id: 'fac-iitg-tennis',
    name: 'Main Tennis Courts',
    address: 'Near Subansiri Hostel',
    sport: 'tennis',
    rating: 4.5,
    distance: '0.8 km',
    pricePerSlot: 0,
    availableSlots: 4,
    totalSlots: 6,
    imageGradient: ['#22C55E', '#14B8A6'],
  },
  {
    id: 'fac-iitg-badminton',
    name: 'Indoor Badminton Arena',
    address: 'Old SAC Building, IITG',
    sport: 'badminton',
    rating: 4.7,
    distance: '0.5 km',
    pricePerSlot: 0,
    availableSlots: 2,
    totalSlots: 8,
    imageGradient: ['#7C3AED', '#14B8A6'],
  },
  {
    id: 'fac-iitg-football',
    name: 'Main Football Field',
    address: 'Sports Complex, IITG',
    sport: 'football',
    rating: 4.9,
    distance: '1.1 km',
    pricePerSlot: 0,
    availableSlots: 1,
    totalSlots: 2,
    imageGradient: ['#10B981', '#3B82F6'],
  },
  {
    id: 'fac-iitg-cricket',
    name: 'Cricket Ground',
    address: 'Sports Complex, IITG',
    sport: 'cricket',
    rating: 4.6,
    distance: '1.2 km',
    pricePerSlot: 0,
    availableSlots: 1,
    totalSlots: 1,
    imageGradient: ['#3B82F6', '#6366F1'],
  },
];

// ─── Time slot generator (mock — replace with API) ────────────────────────────

export function generateTimeSlots(facilityId: string): TimeSlot[] {
  const hours = Array.from({ length: 14 }, (_, i) => i + 6); // 06:00 to 19:00

  return hours.map((h, index) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const startTime = `${pad(h)}:00`;
    const endTime = `${pad(h + 1)}:00`;

    // Deterministic mock statuses based on facilityId + hour
    const hash = (facilityId.charCodeAt(facilityId.length - 1) + h) % 10;
    let status: TimeSlot['status'] = 'available';
    if (hash < 3) status = 'booked';
    else if (hash === 3) status = 'locked';

    return {
      id: `${facilityId}-slot-${index}`,
      startTime,
      endTime,
      status,
      courtNumber: Math.ceil(Math.random() * 4),
    };
  });
}

// ─── Color helpers ────────────────────────────────────────────────────────────

export const SPORT_ACCENT_COLORS: Record<SportId, { primary: string; glow: string }> = {
  gym:       { primary: '#F59E0B', glow: '#F59E0B40' },
  tennis:    { primary: '#5EEAD4', glow: '#14B8A640' },
  badminton: { primary: '#A78BFA', glow: '#7C3AED40' },
  football:  { primary: '#10B981', glow: '#05966940' },
  cricket:   { primary: '#3B82F6', glow: '#2563EB40' },
  basketball: { primary: '#F97316', glow: '#F9731640' }, // retained for backward compat if any
  swimming:  { primary: '#38BDF8', glow: '#0EA5E940' }, // retained for backward compat if any
};
