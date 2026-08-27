/**
 * CustomTabBar — a fully bespoke floating pill tab bar.
 *
 * Built from scratch using a View rather than relying on Expo Router's
 * default tab bar, giving us 100% control over styling and animation.
 *
 * Features:
 *  - Floating dark glass pill (LinearGradient + subtle border)
 *  - Animated glowing active indicator pill behind the active icon
 *  - Scale + opacity bounce on press
 *  - Short label that appears only on the active tab (slide in)
 *  - Pulsing accent dot on active item
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Tab item config ───────────────────────────────────────────────────────────
const TABS: Record<string, { icon: keyof typeof Ionicons.glyphMap; iconFocused: keyof typeof Ionicons.glyphMap; label: string }> = {
  index:    { icon: 'home-outline',     iconFocused: 'home',     label: 'Home'      },
  bookings: { icon: 'calendar-outline', iconFocused: 'calendar', label: 'Bookings'  },
  profile:  { icon: 'person-outline',   iconFocused: 'person',   label: 'Profile'   },
};

// ─── Single animated tab item ─────────────────────────────────────────────────
function TabItem({
  name,
  isFocused,
  onPress,
}: {
  name: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const labelWidth   = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const glowOpacity  = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  const tab = TABS[name];
  if (!tab) return null;

  // Animate whenever focus changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(labelOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(labelWidth, {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: true,
        overshootClamping: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale: scaleAnim }] }]}>
        {/* Active glow pill */}
        <Animated.View
          style={[
            styles.activePill,
            { opacity: glowOpacity },
          ]}
        />

        {/* Icon */}
        <Ionicons
          name={isFocused ? tab.iconFocused : tab.icon}
          size={22}
          color={isFocused ? '#EAEFFF' : '#6B7FA0'}
        />

        {/* Label slides in when focused */}
        <Animated.View
          style={{
            overflow: 'hidden',
            opacity: labelOpacity,
            transform: [
              {
                scaleX: labelWidth,
              },
            ],
            transformOrigin: 'left',
            maxWidth: labelOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 70],
            }),
          }}
        >
          <Text style={styles.tabLabel}>{tab.label}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Main custom tab bar ───────────────────────────────────────────────────────
export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 16) + 12 }]}>
      <LinearGradient
        colors={['#1A1D2E', '#0F111D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.pill}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              name={route.name}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </LinearGradient>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    minWidth: 44,
  },
  activePill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(124, 58, 237, 0.22)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.25)',
  },
  tabLabel: {
    color: '#EAEFFF',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
    marginLeft: 2,
  },
});
