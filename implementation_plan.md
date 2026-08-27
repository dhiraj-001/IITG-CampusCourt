# Sports Facility Booking App — Implementation Plan

## Architecture

- **Framework**: Expo (React Native) with TypeScript
- **Styling**: NativeWind v4 (Tailwind CSS)
- **Navigation**: Expo Router (file-based routing)
- **State**: Zustand (lightweight, no boilerplate)
- **Icons**: Custom SVG sport silhouettes via `react-native-svg`
- **Bottom Sheet**: `@gorhom/bottom-sheet`
- **QR Code**: `react-native-qrcode-svg` (minted ONLY on success screen)

## Screen Flow
1. `app/(tabs)/index.tsx` → Discovery Screen
2. `app/slot-selection.tsx` → Time Grid
3. Modal overlay → Checkout Hold (bottom sheet)
4. `app/gate-pass.tsx` → Digital Ticket / Gate Pass

## File Structure
```
app/
  _layout.tsx
  index.tsx              ← Discovery Screen
  slot-selection.tsx     ← Time Grid
  gate-pass.tsx          ← Digital Gate Pass

components/
  SportIcon.tsx          ← Custom SVG sport silhouettes (circular FABs)
  TimeSlotGrid.tsx       ← Pill-shaped time slot indicators
  CheckoutModal.tsx      ← Bottom sheet + countdown
  GatePassCard.tsx       ← QR ticket (minted on success only)
  LiveDot.tsx            ← Pulsing live availability indicator

store/
  bookingStore.ts        ← Zustand state (sport, facility, slot, booking)

constants/
  theme.ts               ← Color tokens, gradients
  sports.ts              ← Sport definitions with SVG paths
```
