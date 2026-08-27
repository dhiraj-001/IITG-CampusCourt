import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, View, Text } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
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

function FootballIcon({ color }: { color: string }) {
  return (
    <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <Circle cx="19" cy="19" r="13" stroke={color} strokeWidth="2" fill="none" />
      {/* Basic pentagon/hexagon lines for soccer ball */}
      <Path d="M19 12 L24 16 L22 22 L16 22 L14 16 Z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <Path d="M19 12 L19 6" stroke={color} strokeWidth="1.5" />
      <Path d="M24 16 L31 14" stroke={color} strokeWidth="1.5" />
      <Path d="M22 22 L27 28" stroke={color} strokeWidth="1.5" />
      <Path d="M16 22 L11 28" stroke={color} strokeWidth="1.5" />
      <Path d="M14 16 L7 14" stroke={color} strokeWidth="1.5" />
      <Circle cx="19" cy="19" r="11" fill={color} opacity={0.12} />
    </Svg>
  );
}

function CricketIcon({ color }: { color: string }) {
  return (
    <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      {/* Bat Handle */}
      <Path d="M26 6 L28 8 L24 12 L22 10 Z" fill={color} opacity={0.9} />
      <Path d="M26 6 L28 8 L24 12 L22 10 Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Bat Blade */}
      <Path d="M24 12 L28 16 L14 30 Q12 32 10 30 L8 28 Q6 26 8 24 L22 10 Z" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Bat details */}
      <Path d="M20 16 L14 22" stroke={color} strokeWidth="1" opacity={0.6} />
      {/* Ball */}
      <Circle cx="28" cy="28" r="4" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="28" cy="28" r="3" fill={color} opacity={0.2} />
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
  football:  (c) => <FootballIcon color={c} />,
  cricket:   (c) => <CricketIcon color={c} />,
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
    <Pressable onPress={handlePress} style={{ marginHorizontal: 6 }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
        }}
      >
        <LinearGradient
          colors={
            isSelected
              ? ['#2A2E45', '#1E2130'] // Raised, elevated gradient
              : ['#1E2130', '#131525'] // Recessed gradient for unselected
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 52,
            borderRadius: 26,
            paddingLeft: 8,
            paddingRight: 20,
            borderWidth: isSelected ? 1.5 : 1,
            borderColor: isSelected ? accentColor?.primary : '#38405E',
            shadowColor: isSelected ? accentColor?.primary : '#000',
            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
            shadowOpacity: isSelected ? 0.6 : 0.3,
            shadowRadius: isSelected ? 10 : 4,
            elevation: isSelected ? 8 : 2,
            gap: 6,
          }}
        >
          {/* Icon (Scaled down slightly for pill proportions) */}
          <View style={{ transform: [{ scale: 0.85 }], width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}>
            {ICON_MAP[sport.id]?.(isSelected ? accentColor?.primary ?? '#A78BFA' : '#6B7FA0')}
          </View>

          {/* Label */}
          <Text
            style={{
              fontSize: 13,
              fontFamily: isSelected ? 'Inter_600SemiBold' : 'Inter_500Medium',
              color: isSelected ? '#EAEFFF' : '#8FA3C0',
              letterSpacing: 0.2,
            }}
          >
            {sport.label}
          </Text>

          {/* Live availability dot */}
          {isAvailable && (
            <Animated.View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#22C55E',
                transform: [{ scale: pulseAnim }],
                opacity: 0.9,
                marginLeft: 4,
              }}
            />
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
