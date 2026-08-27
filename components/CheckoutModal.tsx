import React, { useEffect, useRef, useCallback, forwardRef, useMemo, useState } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBookingStore } from '../store/bookingStore';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(targetDate: Date | null): { minutes: number; seconds: number; expired: boolean } {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!targetDate) return;

    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      setRemaining(Math.max(0, diff));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return {
    minutes: Math.floor(remaining / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
    expired: remaining === 0 && targetDate !== null,
  };
}

// ─── Animated countdown ring ──────────────────────────────────────────────────

function CountdownRing({ minutes, seconds, expired }: { minutes: number; seconds: number; expired: boolean }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const timerColor = expired ? '#F43F5E' : minutes < 1 ? '#F59E0B' : '#A78BFA';

  return (
    <View style={styles.ringContainer}>
      {/* Spinning border ring */}
      <Animated.View style={[styles.spinRing, { transform: [{ rotate }], borderTopColor: timerColor }]} />

      {/* Inner circle */}
      <View style={styles.innerCircle}>
        <Text style={[styles.timerText, { color: timerColor }]}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>
        <Text style={styles.timerLabel}>{expired ? 'EXPIRED' : 'HOLD ACTIVE'}</Text>
      </View>
    </View>
  );
}

// ─── Checkout Modal ───────────────────────────────────────────────────────────

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CheckoutModal = forwardRef<BottomSheet, CheckoutModalProps>(
  ({ visible, onClose }, ref) => {
    const { selectedFacility, selectedSlot, selectedSport, holdExpiresAt, confirmBooking, releaseHold } =
      useBookingStore();
    const router = useRouter();

    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');

    const snapPoints = useMemo(() => ['65%', '90%'], []);
    const { minutes, seconds, expired } = useCountdown(holdExpiresAt);

    useEffect(() => {
      if (expired) {
        releaseHold();
        onClose();
      }
    }, [expired]);

    const handleConfirm = useCallback(() => {
      if (!userName.trim() || !userPhone.trim()) return;
      confirmBooking(userName.trim(), userPhone.trim());
      onClose();
      router.push('/gate-pass');
    }, [userName, userPhone, confirmBooking, onClose, router]);

    if (!selectedFacility || !selectedSlot || !selectedSport) return null;

    const totalPrice = selectedFacility.pricePerSlot;

    return (
      <BottomSheet
        ref={ref}
        index={visible ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.content}>
          {/* Header */}
          <Text style={styles.title}>Secure Your Slot</Text>
          <Text style={styles.subtitle}>
            Your slot is temporarily held. Complete payment before time runs out.
          </Text>

          {/* Countdown */}
          <CountdownRing minutes={minutes} seconds={seconds} expired={expired} />

          {/* Booking summary */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Sport</Text>
              <Text style={styles.summaryValue}>{selectedSport.label}</Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>
                {selectedSlot.startTime} – {selectedSlot.endTime}
              </Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Venue</Text>
              <Text style={styles.summaryValue}>{selectedFacility.name}</Text>
            </View>
          </View>

          {/* User inputs */}
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor="#6B7FA0"
            value={userName}
            onChangeText={setUserName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#6B7FA0"
            keyboardType="phone-pad"
            value={userPhone}
            onChangeText={setUserPhone}
          />

          {/* Price + Confirm */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.priceValue}>₹{totalPrice}</Text>
            </View>

            <TouchableOpacity
              style={[styles.confirmBtn, (!userName || !userPhone) && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={!userName || !userPhone}
            >
              <Text style={styles.confirmBtnText}>Confirm & Pay →</Text>
            </TouchableOpacity>
          </View>

          {/* Release link */}
          <TouchableOpacity onPress={() => { releaseHold(); onClose(); }} style={styles.releaseLink}>
            <Text style={styles.releaseLinkText}>Release Hold</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

CheckoutModal.displayName = 'CheckoutModal';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: '#131525', borderRadius: 24 },
  handle: { backgroundColor: '#38405E', width: 40 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },

  title: { color: '#EAEFFF', fontSize: 22, fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 6 },
  subtitle: { color: '#8FA3C0', fontSize: 13, marginBottom: 20 },

  ringContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#38405E',
    borderTopColor: '#A78BFA',
  },
  innerCircle: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: '#1E2130',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 26,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#A78BFA',
    letterSpacing: 1,
  },
  timerLabel: {
    fontSize: 8,
    color: '#8FA3C0',
    letterSpacing: 2,
    marginTop: 2,
  },

  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  summaryPill: {
    flex: 1,
    backgroundColor: '#1E2130',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38405E',
    padding: 10,
    alignItems: 'center',
  },
  summaryLabel: { color: '#8FA3C0', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
  summaryValue: { color: '#EAEFFF', fontSize: 11, fontFamily: 'SpaceGrotesk_700Bold', marginTop: 3, textAlign: 'center' },

  input: {
    backgroundColor: '#1E2130',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#38405E',
    color: '#EAEFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    marginBottom: 12,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  priceLabel: { color: '#8FA3C0', fontSize: 12 },
  priceValue: { color: '#EAEFFF', fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold' },

  confirmBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { color: '#fff', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14 },

  releaseLink: { alignSelf: 'center', paddingVertical: 8 },
  releaseLinkText: { color: '#F43F5E', fontSize: 12, textDecorationLine: 'underline' },
});
