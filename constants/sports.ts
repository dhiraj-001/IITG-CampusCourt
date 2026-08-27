import { Facility, Sport, SportId, TimeSlot } from '../store/bookingStore';

// ─── Sports catalogue ─────────────────────────────────────────────────────────

export const SPORTS: Sport[] = [
  { id: 'badminton', label: 'Badminton', emoji: '🏸' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'gym', label: 'Gym', emoji: '🏋️' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'swimming', label: 'Swimming', emoji: '🏊' },
];

// ─── Facility catalogue (mock — replace with API) ─────────────────────────────

export const FACILITIES: Facility[] = [
  {
    id: 'fac-001',
    name: 'Arena Prime',
    address: 'Sector 18, Noida',
    sport: 'badminton',
    rating: 4.8,
    distance: '1.2 km',
    pricePerSlot: 350,
    availableSlots: 4,
    totalSlots: 8,
    imageGradient: ['#7C3AED', '#14B8A6'],
  },
  {
    id: 'fac-002',
    name: 'Smash Zone',
    address: 'DLF Phase 3, Gurugram',
    sport: 'badminton',
    rating: 4.5,
    distance: '3.1 km',
    pricePerSlot: 280,
    availableSlots: 2,
    totalSlots: 6,
    imageGradient: ['#A78BFA', '#7C3AED'],
  },
  {
    id: 'fac-003',
    name: 'Ace Courts',
    address: 'Vasant Kunj, Delhi',
    sport: 'tennis',
    rating: 4.9,
    distance: '2.4 km',
    pricePerSlot: 600,
    availableSlots: 3,
    totalSlots: 5,
    imageGradient: ['#22C55E', '#14B8A6'],
  },
  {
    id: 'fac-004',
    name: 'Baseline Club',
    address: 'Saket, Delhi',
    sport: 'tennis',
    rating: 4.6,
    distance: '4.8 km',
    pricePerSlot: 500,
    availableSlots: 1,
    totalSlots: 4,
    imageGradient: ['#14B8A6', '#5EEAD4'],
  },
  {
    id: 'fac-005',
    name: 'Iron Temple',
    address: 'Connaught Place, Delhi',
    sport: 'gym',
    rating: 4.7,
    distance: '0.8 km',
    pricePerSlot: 200,
    availableSlots: 12,
    totalSlots: 20,
    imageGradient: ['#F59E0B', '#F43F5E'],
  },
  {
    id: 'fac-006',
    name: 'Pump House',
    address: 'Lajpat Nagar, Delhi',
    sport: 'gym',
    rating: 4.4,
    distance: '2.0 km',
    pricePerSlot: 150,
    availableSlots: 8,
    totalSlots: 15,
    imageGradient: ['#F43F5E', '#A78BFA'],
  },
  {
    id: 'fac-007',
    name: 'Hoop City',
    address: 'Rohini, Delhi',
    sport: 'basketball',
    rating: 4.3,
    distance: '5.5 km',
    pricePerSlot: 400,
    availableSlots: 2,
    totalSlots: 4,
    imageGradient: ['#F59E0B', '#14B8A6'],
  },
  {
    id: 'fac-008',
    name: 'Aqua Flow',
    address: 'Greater Kailash, Delhi',
    sport: 'swimming',
    rating: 4.8,
    distance: '3.2 km',
    pricePerSlot: 450,
    availableSlots: 5,
    totalSlots: 10,
    imageGradient: ['#14B8A6', '#7C3AED'],
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
  badminton: { primary: '#A78BFA', glow: '#7C3AED40' },
  tennis:    { primary: '#5EEAD4', glow: '#14B8A640' },
  gym:       { primary: '#F59E0B', glow: '#F59E0B40' },
  basketball: { primary: '#F97316', glow: '#F9731640' },
  swimming:  { primary: '#38BDF8', glow: '#0EA5E940' },
};
