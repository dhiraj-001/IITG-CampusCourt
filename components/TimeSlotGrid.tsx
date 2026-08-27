import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TimeSlot } from '../store/bookingStore';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  available: {
    bgGradient: ['#14B8A615', '#14B8A605'] as const,
    border: '#14B8A6',
    text: '#5EEAD4',
    label: '',
    interactive: true,
  },
  locked: {
    bgGradient: ['#F59E0B15', '#F59E0B05'] as const,
    border: '#F59E0B',
    text: '#FCD34D',
    label: '🔒',
    interactive: false,
  },
  booked: {
    bgGradient: ['#F43F5E15', '#F43F5E05'] as const,
    border: '#F43F5E40',
    text: '#FB7185',
    label: '✕',
    interactive: false,
  },
  selected: {
    bgGradient: ['#A78BFA', '#7C3AED'] as const,
    border: '#A78BFA',
    text: '#0D0E1A',
    label: '✓',
    interactive: true,
  },
} as const;

// ─── Hexagonal / Pill time slot ───────────────────────────────────────────────

interface TimeSlotItemProps {
  slot: TimeSlot;
  isSelected: boolean;
  onPress: (slot: TimeSlot) => void;
}

export function TimeSlotItem({ slot, isSelected, onPress }: TimeSlotItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const effectiveStatus = isSelected ? 'selected' : slot.status;
  const config = STATUS_CONFIG[effectiveStatus];

  // Shimmer on available slots
  useEffect(() => {
    if (slot.status === 'available' && !isSelected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      shimmerAnim.setValue(0);
    }
  }, [slot.status, isSelected]);

  const handlePress = () => {
    if (!config.interactive) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200 }),
    ]).start();
    onPress(slot);
  };

  const borderOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <Pressable onPress={handlePress} disabled={!config.interactive}>
      <AnimatedLinearGradient
        colors={config.bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          transform: [{ scale: scaleAnim }],
          // Pill / stadium shape
          borderRadius: 22,
          borderWidth: 1,
          borderColor: config.border,
          paddingHorizontal: 12,
          paddingVertical: 14,
          marginBottom: 10,
          marginHorizontal: 4,
          minWidth: 86,
          alignItems: 'center',
          opacity: slot.status === 'booked' ? 0.4 : 1,
        }}
      >
        {/* Time range */}
        <Text style={{ color: config.text, fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 0.5 }}>
          {slot.startTime}
        </Text>
        <Text style={{ color: config.text, fontSize: 10, opacity: 0.5, marginVertical: 2 }}>↓</Text>
        <Text style={{ color: config.text, fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 0.5 }}>
          {slot.endTime}
        </Text>

        {/* Status icon */}
        {config.label ? (
          <Text style={{ marginTop: 6, fontSize: 10, color: config.text, opacity: 0.8 }}>{config.label}</Text>
        ) : (
          // Live available dot
          <Animated.View
            style={{
              marginTop: 6,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#14B8A6',
              opacity: borderOpacity,
            }}
          />
        )}
      </AnimatedLinearGradient>
    </Pressable>
  );
}

// ─── Legend strip ─────────────────────────────────────────────────────────────

export function SlotLegend() {
  const items = [
    { color: '#14B8A6', label: 'Available' },
    { color: '#F59E0B', label: 'Locked' },
    { color: '#F43F5E', label: 'Booked' },
    { color: '#A78BFA', label: 'Selected' },
  ];

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
      {items.map((item) => (
        <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: item.color,
            }}
          />
          <Text style={{ color: '#8FA3C0', fontSize: 10 }}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
