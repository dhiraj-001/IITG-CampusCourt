import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, View, Text } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';
import { Sport } from '../store/bookingStore';
import { SPORT_ACCENT_COLORS } from '../constants/sports';

// ─── Individual SVG Sport Silhouettes ─────────────────────────────────────────

function BadmintonIcon({ color }: { color: string }) {
  return (
    <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Shuttlecock base */}
      <Ellipse cx="19" cy="28" rx="6" ry="3" fill={color} opacity={0.9} />
      {/* Racket outline */}
      <Ellipse cx="19" cy="13" rx="9" ry="10" stroke={color} strokeWidth="2" fill="none" />
      {/* Racket strings horizontal */}
      <Path d="M10.5 10 L27.5 10" stroke={color} strokeWidth="0.8" opacity={0.6} />
      <Path d="M10.2 13 L27.8 13" stroke={color} strokeWidth="0.8" opacity={0.6} />
      <Path d="M10.5 16 L27.5 16" stroke={color} strokeWidth="0.8" opacity={0.6} />
      {/* Racket strings vertical */}
      <Path d="M16 3.5 L16 22.5" stroke={color} strokeWidth="0.8" opacity={0.6} />
      <Path d="M19 3 L19 23" stroke={color} strokeWidth="0.8" opacity={0.6} />
      <Path d="M22 3.5 L22 22.5" stroke={color} strokeWidth="0.8" opacity={0.6} />
      {/* Handle */}
      <Path d="M19 23 L19 31" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Shuttlecock feathers */}
      <Path d="M16 26 Q13 22 15 19" stroke={color} strokeWidth="1" fill="none" opacity={0.7} />
      <Path d="M22 26 Q25 22 23 19" stroke={color} strokeWidth="1" fill="none" opacity={0.7} />
    </Svg>
  );
}

function TennisIcon({ color }: { color: string }) {
  return (
    <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Ball */}
      <Circle cx="19" cy="19" r="13" stroke={color} strokeWidth="2" fill="none" />
      {/* Seam curves */}
      <Path
        d="M7 14 Q12 19 7 24"
        stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
      />
      <Path
        d="M31 14 Q26 19 31 24"
        stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
      />
      {/* Ball fill hint */}
      <Circle cx="19" cy="19" r="11" fill={color} opacity={0.12} />
    </Svg>
  );
}

function GymIcon({ color }: { color: string }) {
  return (
    <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Left weight plate */}
      <Ellipse cx="5" cy="19" rx="3" ry="7" fill={color} opacity={0.9} />
      <Ellipse cx="9" cy="19" rx="2" ry="10" fill={color} opacity={0.7} />
      {/* Right weight plate */}
      <Ellipse cx="33" cy="19" rx="3" ry="7" fill={color} opacity={0.9} />
      <Ellipse cx="29" cy="19" rx="2" ry="10" fill={color} opacity={0.7} />
      {/* Bar */}
      <Path d="M11 19 L27 19" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Grip center */}
      <Path d="M15 16 L23 16" stroke={color} strokeWidth="5" strokeLinecap="round" opacity={0.5} />
      <Path d="M15 22 L23 22" stroke={color} strokeWidth="5" strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}

function BasketballIcon({ color }: { color: string }) {
  return (
    <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <Circle cx="19" cy="19" r="13" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="19" cy="19" r="11" fill={color} opacity={0.12} />
      {/* Seam lines */}
      <Path d="M6 19 L32 19" stroke={color} strokeWidth="1.5" />
      <Path d="M19 6 L19 32" stroke={color} strokeWidth="1.5" />
      <Path d="M8 10 Q14 19 8 28" stroke={color} strokeWidth="1.5" fill="none" />
      <Path d="M30 10 Q24 19 30 28" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function SwimmingIcon({ color }: { color: string }) {
  return (
    <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Swimmer body */}
      <Circle cx="27" cy="10" r="3.5" fill={color} opacity={0.9} />
      {/* Arm stroke */}
      <Path d="M27 13 Q22 15 15 12 Q10 10 6 14" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Body */}
      <Path d="M24 15 Q22 20 20 24" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Legs kick */}
      <Path d="M20 24 Q16 28 12 26" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M20 24 Q17 30 14 30" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Water waves */}
      <Path d="M4 31 Q8 28 12 31 Q16 34 20 31 Q24 28 28 31 Q32 34 36 31" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Sport Icon Map ───────────────────────────────────────────────────────────

const ICON_MAP: Record<string, (color: string) => React.ReactNode> = {
  badminton: (c) => <BadmintonIcon color={c} />,
  tennis:    (c) => <TennisIcon color={c} />,
  gym:       (c) => <GymIcon color={c} />,
  basketball: (c) => <BasketballIcon color={c} />,
  swimming:  (c) => <SwimmingIcon color={c} />,
};

// ─── Circular FAB Sport Button ────────────────────────────────────────────────

interface SportIconButtonProps {
  sport: Sport;
  isSelected: boolean;
  isAvailable: boolean; // live availability
  onPress: () => void;
}

export function SportIconButton({ sport, isSelected, isAvailable, onPress }: SportIconButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const accentColor = SPORT_ACCENT_COLORS[sport.id as keyof typeof SPORT_ACCENT_COLORS];

  // Glow pulse on selection
  useEffect(() => {
    if (isSelected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isSelected]);

  // Availability pulse on the live dot
  useEffect(() => {
    if (isAvailable) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.6, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isAvailable]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    // Fixed width of 88px gives icon (76px) + 6px padding each side — plenty of room
    <Pressable onPress={handlePress} style={{ alignItems: 'center', width: 88, marginHorizontal: 6 }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
          alignItems: 'center',
        }}
      >
        {/* Outer glow ring */}
        {isSelected && (
          <View
            style={{
              position: 'absolute',
              width: 90,
              height: 90,
              borderRadius: 45,
              top: -7,
              left: -7,
              backgroundColor: accentColor?.glow ?? '#7C3AED40',
            }}
          />
        )}

        {/* Circle FAB */}
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: isSelected ? '#252840' : '#1E2130',
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? accentColor?.primary : '#38405E',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: accentColor?.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isSelected ? 0.6 : 0,
            shadowRadius: 12,
            elevation: isSelected ? 12 : 0,
          }}
        >
          {ICON_MAP[sport.id]?.(isSelected ? accentColor?.primary ?? '#A78BFA' : '#6B7FA0')}
        </View>

        {/* Live availability dot */}
        {isAvailable && (
          <View style={{ position: 'absolute', top: 2, right: 6 }}>
            <Animated.View
              style={{
                width: 9,
                height: 9,
                borderRadius: 4.5,
                backgroundColor: '#22C55E',
                transform: [{ scale: pulseAnim }],
                opacity: 0.9,
              }}
            />
          </View>
        )}
      </Animated.View>

      {/* Label — fixed width matches the pressable, centered, no uppercase crunch */}
      <Text
        numberOfLines={1}
        style={{
          marginTop: 8,
          fontSize: 11,
          fontWeight: isSelected ? '700' : '400',
          color: isSelected ? accentColor?.primary : '#6B7FA0',
          letterSpacing: 0,
          textAlign: 'center',
          width: 84,
        }}
      >
        {sport.label}
      </Text>
    </Pressable>
  );
}
