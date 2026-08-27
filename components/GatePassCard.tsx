import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BookingConfirmation } from '../store/bookingStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

// ─── Gate Pass Card ───────────────────────────────────────────────────────────
// IMPORTANT: The QR code is NEVER present during general user registration.
// It is ONLY rendered here, when a BookingConfirmation object (with a minted
// qrPayload) is passed. The qrPayload is generated in bookingStore.confirmBooking()
// and does not exist anywhere in the app before that moment.

interface GatePassCardProps {
  confirmation: BookingConfirmation;
}

export function GatePassCard({ confirmation }: GatePassCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const qrScaleAnim = useRef(new Animated.Value(0.6)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }),
      ]),
      Animated.spring(qrScaleAnim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 7 }),
    ]).start();

    // Shimmer loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1, 0.3] });

  const bookedDate = new Date(confirmation.bookedAt);
  const dateStr = bookedDate.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Gradient ticket card */}
      <LinearGradient
        colors={['#252840', '#131525']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Top glow strip */}
        <LinearGradient
          colors={['#7C3AED', '#14B8A6']}
          style={styles.topStrip}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.facilityName}>{confirmation.facility.name}</Text>
            <Text style={styles.address}>{confirmation.facility.address}</Text>
          </View>
          <View style={styles.sportBadge}>
            <Text style={styles.sportEmoji}>{confirmation.sport.emoji}</Text>
          </View>
        </View>

        {/* Dashed divider — mimics ticket perforation */}
        <View style={styles.perforation}>
          <View style={styles.halfCircleLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.halfCircleRight} />
        </View>

        {/* Main info row */}
        <View style={styles.infoRow}>
          <InfoBlock label="Date" value={dateStr} />
          <InfoBlock label="Slot" value={`${confirmation.slot.startTime} – ${confirmation.slot.endTime}`} />
          <InfoBlock label="Sport" value={confirmation.sport.label} />
        </View>

        {/* Booking ID */}
        <View style={styles.bookingIdRow}>
          <Text style={styles.bookingIdLabel}>BOOKING ID</Text>
          <Animated.Text style={[styles.bookingId, { opacity: shimmerOpacity }]}>
            {confirmation.bookingId}
          </Animated.Text>
        </View>

        {/* Second perforation above QR */}
        <View style={styles.perforation}>
          <View style={styles.halfCircleLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.halfCircleRight} />
        </View>

        {/* ── QR Code ── minted ONLY on booking confirmation, never during registration ── */}
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>SCAN AT GATE</Text>
          <Animated.View
            style={[styles.qrWrapper, { transform: [{ scale: qrScaleAnim }] }]}
          >
            <QRCode
              value={confirmation.qrPayload}   // unique payload minted at confirmBooking()
              size={140}
              backgroundColor="transparent"
              color="#EAEFFF"
              logoBackgroundColor="transparent"
            />
          </Animated.View>

          {/* Gate OTP */}
          <View style={styles.gateCodeRow}>
            <Text style={styles.gateCodeLabel}>GATE OTP</Text>
            {confirmation.gateCode.split('').map((digit, i) => (
              <View key={i} style={styles.digitBox}>
                <Text style={styles.digitText}>{digit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* User strip */}
        <LinearGradient
          colors={['#7C3AED20', '#14B8A620']}
          style={styles.userStrip}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.userName}>{confirmation.userName}</Text>
          <Text style={styles.userPhone}>{confirmation.userPhone}</Text>
        </LinearGradient>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Info block ───────────────────────────────────────────────────────────────

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ color: '#8FA3C0', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>
        {label}
      </Text>
      <Text style={{ color: '#EAEFFF', fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold', marginTop: 4, textAlign: 'center' }}>
        {value}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    alignSelf: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#38405E',
  },
  topStrip: {
    height: 4,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
  },
  facilityName: { color: '#EAEFFF', fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold' },
  address: { color: '#8FA3C0', fontSize: 12, marginTop: 3 },
  sportBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#252840',
    borderWidth: 1,
    borderColor: '#38405E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sportEmoji: { fontSize: 24 },

  perforation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    overflow: 'hidden',
  },
  halfCircleLeft: {
    width: 16,
    height: 32,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#0D0E1A',
    marginLeft: -2,
  },
  halfCircleRight: {
    width: 16,
    height: 32,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: '#0D0E1A',
    marginRight: -2,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#38405E',
    borderStyle: 'dashed',
  },

  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: 22,
    paddingVertical: 16,
    gap: 4,
  },

  bookingIdRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  bookingIdLabel: {
    color: '#8FA3C0',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bookingId: {
    color: '#A78BFA',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 3,
    marginTop: 4,
  },

  qrSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 22,
  },
  qrLabel: {
    color: '#8FA3C0',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#252840',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#38405E',
  },

  gateCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  gateCodeLabel: {
    color: '#8FA3C0',
    fontSize: 9,
    letterSpacing: 1.5,
    marginRight: 8,
    textTransform: 'uppercase',
  },
  digitBox: {
    width: 30,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1E2130',
    borderWidth: 1,
    borderColor: '#A78BFA40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitText: { color: '#A78BFA', fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold' },

  userStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  userName: { color: '#EAEFFF', fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold' },
  userPhone: { color: '#8FA3C0', fontSize: 12 },
});
