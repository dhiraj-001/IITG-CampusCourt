/**
 * SCREEN 4 — Gate Pass / Digital Ticket
 *
 * CRITICAL DESIGN RULE:
 * The QR code and booking ID are NEVER generated during general user registration.
 * They are dynamically "minted" inside bookingStore.confirmBooking() and are ONLY
 * accessible once a BookingConfirmation object exists in the store.
 * This screen simply renders that confirmation — if no confirmation exists, it
 * redirects back rather than showing any QR placeholder.
 */
import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { GatePassCard } from '../components/GatePassCard';
import { useBookingStore } from '../store/bookingStore';

export default function GatePassScreen() {
  const router = useRouter();
  const { confirmation, resetBooking } = useBookingStore();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(confettiAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Guard: if no confirmation exists, redirect to home ────────────────────
  // This enforces the rule that the gate pass is only accessible post-booking.
  useEffect(() => {
    if (!confirmation) {
      router.replace('/');
    }
  }, [confirmation, router]);

  const handleShare = useCallback(async () => {
    if (!confirmation) return;
    try {
      await Share.share({
        message:
          `🏆 SportBook Confirmation\n` +
          `Booking ID: ${confirmation.bookingId}\n` +
          `Venue: ${confirmation.facility.name}\n` +
          `Sport: ${confirmation.sport.label}\n` +
          `Slot: ${confirmation.slot.startTime} – ${confirmation.slot.endTime}\n` +
          `Gate OTP: ${confirmation.gateCode}`,
        title: 'My SportBook Ticket',
      });
    } catch (_) {}
  }, [confirmation]);

  const handleNewBooking = useCallback(() => {
    resetBooking();
    router.replace('/');
  }, [resetBooking, router]);

  if (!confirmation) return null;

  return (
    <View style={styles.container}>
      {/* ── Success banner ── */}
      <LinearGradient
        colors={['#7C3AED20', '#0D0E1A']}
        style={styles.successBanner}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
            alignItems: 'center',
          }}
        >
          {/* Success ring */}
          <View style={styles.successRing}>
            <View style={styles.successInner}>
              <Text style={styles.successCheck}>✓</Text>
            </View>
          </View>

          <Text style={styles.successTitle}>Slot Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your gate pass is ready. Show the QR code at the facility entrance.
          </Text>
        </Animated.View>

        {/* Step indicator — all done */}
        <View style={styles.stepRow}>
          {['Sport', 'Slot', 'Checkout', 'Gate Pass'].map((step, i) => (
            <React.Fragment key={step}>
              <View style={styles.stepDotDone}>
                <Ionicons name="checkmark" size={11} color="#fff" />
              </View>
              {i < 3 && <View style={styles.stepLineDone} />}
            </React.Fragment>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Gate Pass Card (renders QR minted at confirmBooking) ── */}
        <GatePassCard confirmation={confirmation} />

        {/* ── Action row ── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color="#A78BFA" />
            <Text style={styles.actionBtnText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="calendar-outline" size={18} color="#5EEAD4" />
            <Text style={[styles.actionBtnText, { color: '#5EEAD4' }]}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>

        {/* ── Info note about QR ── */}
        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={14} color="#22C55E" />
          <Text style={styles.securityNoteText}>
            This QR code is uniquely minted for your booking. It is never generated during account
            registration — only upon slot confirmation.
          </Text>
        </View>

        {/* ── Book again ── */}
        <TouchableOpacity style={styles.newBookingBtn} onPress={handleNewBooking}>
          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            style={styles.newBookingGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.newBookingText}>Book Another Slot</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0E1A' },

  successBanner: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  successRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  successInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCheck: { color: '#fff', fontSize: 28, fontFamily: 'SpaceGrotesk_700Bold' },

  successTitle: {
    color: '#EAEFFF',
    fontSize: 26,
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 8,
  },
  successSubtitle: {
    color: '#8FA3C0',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  stepDotDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLineDone: { flex: 1, height: 2, backgroundColor: '#22C55E', marginHorizontal: 4 },

  scrollContent: { paddingTop: 20, paddingHorizontal: 24 },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E2130',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#38405E',
    paddingVertical: 14,
  },
  actionBtnText: { color: '#A78BFA', fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold' },

  securityNote: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#1E2130',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22C55E30',
    padding: 14,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  securityNoteText: {
    flex: 1,
    color: '#8FA3C0',
    fontSize: 11,
    lineHeight: 17,
  },

  newBookingBtn: { borderRadius: 20, overflow: 'hidden' },
  newBookingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  newBookingText: { color: '#fff', fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold' },
});
