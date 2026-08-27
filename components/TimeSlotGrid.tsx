import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { TimeSlot } from '../store/bookingStore';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  available: {
    bg: '#14B8A615',
    border: '#14B8A6',
    text: '#5EEAD4',
    label: '',
    interactive: true,
  },
  locked: {
    bg: '#F59E0B15',
    border: '#F59E0B',
    text: '#FCD34D',
    label: '🔒',
    interactive: false,
  },
  booked: {
    bg: '#F43F5E15',
    border: '#F43F5E40',
    text: '#FB7185',
    label: '✕',
    interactive: false,
  },
  selected: {
    bg: '#7C3AED30',
    border: '#A78BFA',
    text: '#E9D5FF',
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
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          // Pill / stadium shape — not a rectangle
          borderRadius: 20,
          borderWidth: isSelected ? 1.5 : 1,
          borderColor: config.border,
          backgroundColor: config.bg,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginBottom: 10,
          marginHorizontal: 4,
          minWidth: 84,
          alignItems: 'center',
          opacity: slot.status === 'booked' ? 0.4 : 1,
        }}
      >
        {/* Time range */}
        <Text style={{ color: config.text, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
          {slot.startTime}
        </Text>
        <Text style={{ color: config.text, fontSize: 10, opacity: 0.7 }}>↓</Text>
        <Text style={{ color: config.text, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
          {slot.endTime}
        </Text>

        {/* Status icon */}
        {config.label ? (
          <Text style={{ marginTop: 4, fontSize: 10 }}>{config.label}</Text>
        ) : (
          // Live available dot
          <View
            style={{
              marginTop: 5,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#14B8A6',
            }}
          />
        )}
      </Animated.View>
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
