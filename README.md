# SportBook — Premium Sports Facility Booking (IITG Edition)

A sleek, dark-mode sports facility booking application built with **Expo (React Native)**. Designed specifically for the **IITG Campus Court** ecosystem with a premium, animated, and dynamic aesthetic inspired by high-end consumer apps.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Expo SDK (React Native) |
| Styling | React Native StyleSheet (Custom Theme) |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Icons | Custom SVG (`react-native-svg`) + `@expo/vector-icons` |
| Bottom Sheet | `@gorhom/bottom-sheet` |
| QR Code | `react-native-qrcode-svg` |
| Gradients | `expo-linear-gradient` |

---

## Project Structure

```text
app/
  _layout.tsx          ← Root layout (GestureHandler + Navigation)
  (tabs)/
    _layout.tsx        ← Tabs layout wiring
    index.tsx          ← SCREEN 1: Discovery (Sport filter + IITG Facilities)
  slot-selection.tsx   ← SCREEN 2: Time slot grid with Floating CTA
  gate-pass.tsx        ← SCREEN 4: Digital gate pass

components/
  CustomTabBar.tsx     ← Custom floating animated glass pill navigation bar
  SportIcon.tsx        ← Custom SVG sport silhouettes (circular FABs)
  TimeSlotGrid.tsx     ← Pill-shaped slot items with status colors
  CheckoutModal.tsx    ← SCREEN 3: Bottom sheet + robust 5-min countdown
  GatePassCard.tsx     ← Ticket card with QR (minted on confirm only)

store/
  bookingStore.ts      ← Zustand state machine + auto-recovery routing
  
constants/
  sports.ts            ← IITG Facility catalogue, Mock slot generator
  typography.ts        ← Font mapping
```

---

## The 4-Step Flow

```text
[1] Discovery → [2] Slot Selection → [3] Checkout Hold → [4] Gate Pass
   (Sport FABs)    (Pill grid)         (5-min timer)       (QR Ticket)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the Expo bundler
npx expo start -c
```

Scan the QR in Expo Go (iOS/Android) or press `w` for web.

---

## Key Features & Engineering Upgrades

1. **Custom Animated Tab Bar**: Replaced standard navigation with a fully bespoke floating glass pill (`CustomTabBar.tsx`). Features hardware-accelerated animations (`scaleX`, `opacity`), animated glowing active indicators, and slide-in labels.
2. **Robust Bottom Sheet Integration**: Fixed edge cases with `@gorhom/bottom-sheet` on Android by keeping the `CheckoutModal` permanently mounted in the background (`index={-1}`). This guarantees the internal animation `ref` is always attached and ready for immediate, lag-free expansion when a slot is locked.
3. **Synchronous React Countdown**: Built a bulletproof 5-minute checkout timer that computes remaining time synchronously during the render phase. This fundamentally solves standard React stale-state bugs that cause modals to prematurely self-destruct.
4. **Resilient Global State Management**: Enhanced Zustand `bookingStore` with self-healing properties. The router automatically auto-detects and repairs missing contexts (e.g., resolving the parent Sport ID from a deeply linked Facility selection) to prevent blank screens.
5. **Precision Touch Targets**: Optimized the Floating CTA lock button to ensure the `TouchableOpacity` wraps the entire gradient surface area, guaranteeing flawlessly responsive interactions regardless of where the user taps on the pill.
6. **Hardware-Accelerated UI**: Removed all non-native animated layout properties (like `maxWidth`) to prevent fatal Metro bundler crashes, shifting entirely to GPU-backed `transform` metrics.

---

## Backend Wiring Points

When connecting to a real server, integrate here:

| Action | Replace With |
|---|---|
| `FACILITIES` array | `GET /facilities?sport=...` |
| `generateTimeSlots()` | `GET /facilities/:id/slots?date=...` |
| `mintBookingId()` | `POST /bookings/hold` → returns `holdId` |
| `confirmBooking()` | `POST /bookings/confirm` → returns signed QR payload |
| `initiateHold()` | Server-side hold with Redis TTL lock |
