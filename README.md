# SportBook — Premium Sports Facility Booking

A sleek, dark-mode sports facility booking application built with **Expo (React Native)** + **NativeWind v4**.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Expo SDK 52 (React Native) |
| Styling | NativeWind v4 (Tailwind CSS) |
| Navigation | Expo Router v4 (file-based) |
| State | Zustand v5 |
| Icons | Custom SVG (`react-native-svg`) + `@expo/vector-icons` |
| Bottom Sheet | `@gorhom/bottom-sheet` v5 |
| QR Code | `react-native-qrcode-svg` |
| Gradients | `expo-linear-gradient` |

---

## Project Structure

```
app/
  _layout.tsx          ← Root layout (GestureHandler + Navigation)
  index.tsx            ← SCREEN 1: Discovery (Sport filter + Facilities)
  slot-selection.tsx   ← SCREEN 2: Time slot grid
  gate-pass.tsx        ← SCREEN 4: Digital gate pass

components/
  SportIcon.tsx        ← Custom SVG sport silhouettes (circular FABs)
  TimeSlotGrid.tsx     ← Pill-shaped slot items with status colors
  CheckoutModal.tsx    ← SCREEN 3: Bottom sheet + 5-min countdown
  GatePassCard.tsx     ← Ticket card with QR (minted on confirm only)

store/
  bookingStore.ts      ← Zustand state machine + QR minting logic

constants/
  sports.ts            ← Sport definitions, facility catalogue, slot generator
```

---

## 4-Step Flow

```
[1] Discovery → [2] Slot Selection → [3] Checkout Hold → [4] Gate Pass
   (Sport FABs)    (Pill grid)         (5-min timer)       (QR Ticket)
```

---

## Getting Started

```bash
npm install --legacy-peer-deps
npx expo start
```

Scan the QR in Expo Go (iOS/Android) or press `w` for web.

---

## Key Design Rules Implemented

1. **No rectangular card boxes** — sport selectors are circular FABs with SVG silhouettes; time slots are pill/stadium shapes.
2. **Live availability dots** — pulsing green dots show real-time slot availability on sport icons and facility cards.
3. **QR never generated at registration** — the `qrPayload` and `bookingId` are minted exclusively inside `bookingStore.confirmBooking()` and only rendered on the Gate Pass screen.
4. **5-minute countdown hold** — checkout modal locks the slot with a live spinning-ring timer.

---

## Backend Wiring Points

| Action | Replace With |
|---|---|
| `FACILITIES` array | `GET /facilities?sport=...` |
| `generateTimeSlots()` | `GET /facilities/:id/slots?date=...` |
| `mintBookingId()` | `POST /bookings/hold` → returns `holdId` |
| `confirmBooking()` | `POST /bookings/confirm` → returns signed QR payload |
| `initiateHold()` | Server-side hold with Redis TTL lock |
