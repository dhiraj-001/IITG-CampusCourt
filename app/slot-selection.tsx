/**
 * SCREEN 2 — Slot Selection
 * Hexagonal / pill time grid for the selected facility.
 * Long-press a slot to open the Checkout Hold modal.
 */
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimeSlotItem, SlotLegend } from '../components/TimeSlotGrid';
import { CheckoutModal } from '../components/CheckoutModal';
import { useBookingStore, TimeSlot } from '../store/bookingStore';
import { generateTimeSlots, SPORT_ACCENT_COLORS, SPORTS } from '../constants/sports';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMNS = 3;

export default function SlotSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedFacility, selectedSport, selectedSlot, selectSlot, initiateHold, releaseHold, selectSport } =
    useBookingStore();

  const [modalVisible, setModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Generate mock slots for the facility
  const slots: TimeSlot[] = selectedFacility ? generateTimeSlots(selectedFacility.id) : [];

  const accent =
    selectedSport && SPORT_ACCENT_COLORS[selectedSport.id as keyof typeof SPORT_ACCENT_COLORS]
      ? SPORT_ACCENT_COLORS[selectedSport.id as keyof typeof SPORT_ACCENT_COLORS]
      : { primary: '#A78BFA', glow: '#7C3AED40' };

  const handleSlotPress = useCallback(
    (slot: TimeSlot) => {
      if (slot.status !== 'available') return;
      selectSlot(slot);
    },
    [selectSlot]
  );

  const handleProceed = useCallback(() => {
    console.log('--- CTA BUTTON PRESSED ---');
    if (!selectedSlot) {
      console.log('ERROR: selectedSlot is null');
      return;
    }
    console.log('Initiating hold for slot:', selectedSlot.id);
    initiateHold();
    
    console.log('Setting modalVisible to true');
    setModalVisible(true);
    
    if (bottomSheetRef.current) {
      console.log('Snapping bottom sheet to index 0');
      bottomSheetRef.current.snapToIndex(0);
    } else {
      console.log('ERROR: bottomSheetRef.current is null!');
    }
  }, [selectedSlot, initiateHold]);

  const handleCloseModal = useCallback(() => {
    if (modalVisible) {
      setModalVisible(false);
      releaseHold();
    }
  }, [modalVisible, releaseHold]);

  if (!selectedFacility) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No facility selected.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Chunk slots into rows of COLUMNS
  const rows: TimeSlot[][] = [];
  for (let i = 0; i < slots.length; i += COLUMNS) {
    rows.push(slots.slice(i, i + COLUMNS));
  }

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient
        colors={selectedFacility.imageGradient as [string, string]}
        style={styles.heroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backCircle}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Facility info */}
        <View style={styles.heroContent}>
          <Text style={styles.heroSport}>{selectedSport?.emoji} {selectedSport?.label}</Text>
          <Text style={styles.heroName}>{selectedFacility.name}</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroMetaText}>📍 {selectedFacility.address}</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>₹{selectedFacility.pricePerSlot}/hr</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ── Step indicator ── */}
      <View style={styles.stepRow}>
        {['Sport', 'Slot', 'Checkout', 'Gate Pass'].map((step, i) => (
          <React.Fragment key={step}>
            <View style={[styles.stepDot, i <= 1 && styles.stepDotActive]}>
              {i < 1 ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : (
                <Text style={[styles.stepNum, i <= 1 && styles.stepNumActive]}>{i + 1}</Text>
              )}
            </View>
            {i < 3 && <View style={[styles.stepLine, i <= 0 && styles.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepLabel}>Step 2 — Pick a Time Slot</Text>

      {/* ── Legend ── */}
      <SlotLegend />

      {/* ── Slot grid — pill-shaped items in a scroll view ── */}
      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.slotRow}>
            {row.map((slot) => (
              <TimeSlotItem
                key={slot.id}
                slot={slot}
                isSelected={selectedSlot?.id === slot.id}
                onPress={handleSlotPress}
              />
            ))}
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Sticky CTA (Floating Pill) ── */}
      <View style={[styles.ctaContainer, { bottom: insets.bottom + 20 }]} pointerEvents="box-none">
        {selectedSlot ? (
          <View style={styles.ctaFloatingWrapper}>
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
            <TouchableOpacity onPress={handleProceed} activeOpacity={0.8} style={{ width: '100%' }}>
              <LinearGradient
                colors={['rgba(124, 58, 237, 0.9)', 'rgba(91, 33, 182, 0.9)']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.ctaInner}>
                  <View>
                    <Text style={styles.ctaTime}>
                      {selectedSlot.startTime} – {selectedSlot.endTime}
                    </Text>
                    <Text style={styles.ctaPrice}>₹{selectedFacility.pricePerSlot} <Text style={{opacity:0.7}}>/ slot</Text></Text>
                  </View>
                  <View style={styles.ctaArrowCircle}>
                    <Ionicons name="lock-closed" size={16} color="#7C3AED" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ctaFloatingWrapper}>
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.ctaDisabled}>
              <Text style={styles.ctaDisabledText}>Select a slot to continue</Text>
            </View>
          </View>
        )}
      </View>

      {/* ── Checkout Bottom Sheet ── */}
      <CheckoutModal
        ref={bottomSheetRef}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0E1A' },

  heroGradient: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroContent: {},
  heroSport: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'SpaceGrotesk_600SemiBold', letterSpacing: 0.5 },
  heroName: { color: '#fff', fontSize: 26, fontFamily: 'SpaceGrotesk_700Bold', marginTop: 4 },
  heroMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  heroMetaText: { color: 'rgba(255,255,255,0.88)', fontSize: 12 },
  priceBadge: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priceText: { color: '#fff', fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold' },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 4,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E2130',
    borderWidth: 1,
    borderColor: '#38405E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: { backgroundColor: '#7C3AED', borderColor: '#A78BFA' },
  stepNum: { color: '#6B7FA0', fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold' },
  stepNumActive: { color: '#fff' },
  stepLine: { flex: 1, height: 1, backgroundColor: '#38405E', marginHorizontal: 4 },
  stepLineActive: { backgroundColor: '#7C3AED' },
  stepLabel: { color: '#8FA3C0', fontSize: 12, letterSpacing: 0.5, paddingHorizontal: 24, marginBottom: 12 },

  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },

  ctaContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaFloatingWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ctaGradient: {
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  ctaInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaTime: { color: '#fff', fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold' },
  ctaPrice: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2, fontFamily: 'Inter_500Medium' },
  ctaArrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDisabled: {
    backgroundColor: 'rgba(30, 33, 48, 0.75)',
    paddingVertical: 20,
    alignItems: 'center',
  },
  ctaDisabledText: { color: '#8FA3C0', fontSize: 14, fontFamily: 'Inter_500Medium' },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0E1A' },
  errorText: { color: '#8FA3C0', fontSize: 16, marginBottom: 20 },
  backBtn: { backgroundColor: '#7C3AED', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  backBtnText: { color: '#fff', fontFamily: 'SpaceGrotesk_700Bold' },
});
