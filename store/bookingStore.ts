import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SportId = 'badminton' | 'tennis' | 'gym' | 'basketball' | 'swimming' | 'football' | 'cricket';

export interface Sport {
  id: SportId;
  label: string;
  emoji: string;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  sport: SportId;
  rating: number;
  distance: string;
  pricePerSlot: number; // in INR
  availableSlots: number;
  totalSlots: number;
  imageGradient: [string, string];
}

export type SlotStatus = 'available' | 'locked' | 'booked' | 'selected';

export interface TimeSlot {
  id: string;
  startTime: string; // "06:00"
  endTime: string;   // "07:00"
  status: SlotStatus;
  lockedBy?: string; // userId if locked
  courtNumber?: number;
}

export interface BookingConfirmation {
  bookingId: string;
  qrPayload: string;       // unique JWT-style payload minted on confirm
  facility: Facility;
  slot: TimeSlot;
  sport: Sport;
  bookedAt: string;        // ISO timestamp
  gateCode: string;        // 6-digit numeric gate OTP
  userName: string;
  userPhone: string;
}

// ─── Store State ──────────────────────────────────────────────────────────────

interface BookingState {
  // Step 1 — Discovery
  selectedSport: Sport | null;
  selectedFacility: Facility | null;

  // Step 2 — Slot Selection
  selectedSlot: TimeSlot | null;

  // Step 3 — Checkout / Hold
  holdExpiresAt: Date | null;       // server-assigned hold expiry
  isHoldActive: boolean;

  // Step 4 — Confirmed booking
  confirmation: BookingConfirmation | null;

  // Actions
  selectSport: (sport: Sport) => void;
  selectFacility: (facility: Facility) => void;
  selectSlot: (slot: TimeSlot) => void;
  initiateHold: () => void;           // sets a 5-min hold
  releaseHold: () => void;
  confirmBooking: (userName: string, userPhone: string) => void;
  resetBooking: () => void;
}

// ─── Mock QR / Booking ID mint ────────────────────────────────────────────────
// In production, these come from your backend POST /bookings/confirm
function mintBookingId(): string {
  return 'BK' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function mintQRPayload(bookingId: string, slotId: string, facilityId: string): string {
  // Simulates a signed JWT payload that the gate scanner validates
  const payload = {
    bk: bookingId,
    sl: slotId,
    fc: facilityId,
    ts: Date.now(),
    sig: Math.random().toString(36).substring(2, 18), // mocked signature
  };
  return JSON.stringify(payload);
}

function mintGateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedSport: null,
  selectedFacility: null,
  selectedSlot: null,
  holdExpiresAt: null,
  isHoldActive: false,
  confirmation: null,

  selectSport: (sport) => set({ selectedSport: sport, selectedFacility: null, selectedSlot: null }),

  selectFacility: (facility) => set({ selectedFacility: facility, selectedSlot: null }),

  selectSlot: (slot) => set({ selectedSlot: slot }),

  initiateHold: () => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    set({ holdExpiresAt: expiresAt, isHoldActive: true });
  },

  releaseHold: () => set({ holdExpiresAt: null, isHoldActive: false, selectedSlot: null }),

  confirmBooking: (userName: string, userPhone: string) => {
    const { selectedFacility, selectedSlot, selectedSport } = get();
    if (!selectedFacility || !selectedSlot || !selectedSport) return;

    const bookingId = mintBookingId();
    const qrPayload = mintQRPayload(bookingId, selectedSlot.id, selectedFacility.id);
    const gateCode = mintGateCode();

    const confirmation: BookingConfirmation = {
      bookingId,
      qrPayload,      // ← minted ONLY here, never during registration
      facility: selectedFacility,
      slot: selectedSlot,
      sport: selectedSport,
      bookedAt: new Date().toISOString(),
      gateCode,
      userName,
      userPhone,
    };

    set({ confirmation, isHoldActive: false, holdExpiresAt: null });
  },

  resetBooking: () =>
    set({
      selectedSport: null,
      selectedFacility: null,
      selectedSlot: null,
      holdExpiresAt: null,
      isHoldActive: false,
      confirmation: null,
    }),
}));
