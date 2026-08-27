/**
 * SCREEN 1 — Discovery Screen (Redesigned)
 *
 * Upgrades:
 * - Full-bleed hero gradient header with ambient glow
 * - Animated stat counters (active courts, venues, members)
 * - Horizontal "Featured" venue carousel as hero cards with gradient overlays
 * - Redesigned sport filter FABs section with better spacing
 * - New vertical facility list with full-width gradient cards
 * - Micro-animations on every interaction
 * - Live availability arc-progress ring
 * - Frosted-glass search bar
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SportIconButton } from '../../components/SportIcon';
import { useBookingStore, Sport, Facility } from '../../store/bookingStore';
import { SPORTS, FACILITIES, SPORT_ACCENT_COLORS } from '../../constants/sports';
import { TYPE } from '../../constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FEATURED_CARD_W = SCREEN_WIDTH * 0.75;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ─── Animated counter hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ─── Pulsing live dot ─────────────────────────────────────────────────────────

function PulseDot({ color = '#22C55E', size = 8 }: { color?: string; size?: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.7, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.8, duration: 800, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale: pulse }],
          opacity,
        }}
      />
      <View style={{ width: size * 0.5, height: size * 0.5, borderRadius: size / 4, backgroundColor: color }} />
    </View>
  );
}

// ─── Glass stat card ─────────────────────────────────────────────────────────

function GlassStatCard({
  value,
  label,
  icon,
  color,
}: {
  value: number;
  label: string;
  icon: string;
  color: string;
}) {
  const count = useCountUp(value);
  return (
    <View
      style={[
        statStyles.card,
        {
          borderColor: color + '30',
          shadowColor: color,
        },
      ]}
    >
      <View style={[statStyles.iconBubble, { backgroundColor: color + '18' }]}>
        <Text style={{ fontSize: 14 }}>{icon}</Text>
      </View>
      <Text style={[statStyles.cardValue, { color }]}>
        {count}
        <Text style={statStyles.plus}>+</Text>
      </Text>
      <Text style={statStyles.cardLabel}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#181B2E',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'flex-start',
    gap: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: { fontSize: 22, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.5, lineHeight: 26 },
  plus: { fontSize: 14, fontFamily: 'SpaceGrotesk_600SemiBold' },
  cardLabel: { color: '#6B7FA0', fontSize: 11, letterSpacing: 0.2, marginTop: -2 },
});

// ─── Availability progress arc ────────────────────────────────────────────────

function AvailabilityRing({ available, total, color }: { available: number; total: number; color: string }) {
  const pct = available / total;
  const dotColor =
    pct > 0.6 ? '#22C55E' : pct > 0.2 ? '#F59E0B' : '#F43F5E';

  // Simulated arc via simple bar fill
  return (
    <View style={ringStyles.wrap}>
      <View style={ringStyles.track}>
        <View style={[ringStyles.fill, { width: `${pct * 100}%` as any, backgroundColor: dotColor }]} />
      </View>
      <View style={ringStyles.row}>
        <PulseDot color={dotColor} size={6} />
        <Text style={[ringStyles.txt, { color: dotColor }]}>
          {available}/{total}
        </Text>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  wrap: { gap: 5 },
  track: {
    width: 70,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  txt: { fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold' },
});

// ─── Featured hero card (horizontal carousel) ─────────────────────────────────

function FeaturedCard({ facility, onPress }: { facility: Facility; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const accent = SPORT_ACCENT_COLORS[facility.sport] ?? { primary: '#A78BFA', glow: '' };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200 }),
    ]).start();
    onPress();
  };

  const sport = SPORTS.find((s) => s.id === facility.sport);

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[featStyles.card, { transform: [{ scale: scaleAnim }] }]}>
        {/* Full-bleed gradient background */}
        <LinearGradient
          colors={[...facility.imageGradient, '#0D0E1A'] as [string, string, string]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Sport emoji watermark */}
        <Text style={featStyles.watermark}>{sport?.emoji}</Text>

        {/* Top row */}
        <View style={featStyles.top}>
          <View style={featStyles.topBadge}>
            <Text style={featStyles.topBadgeText}>{sport?.label?.toUpperCase()}</Text>
          </View>
          <View style={featStyles.ratingBadge}>
            <Text style={featStyles.ratingText}>⭐ {facility.rating}</Text>
          </View>
        </View>

        {/* Bottom info */}
        <View style={featStyles.bottom}>
          <Text style={featStyles.name}>{facility.name}</Text>
          <Text style={featStyles.addr} numberOfLines={1}>
            <Ionicons name="location-sharp" size={10} color="rgba(255,255,255,0.6)" /> {facility.address}
          </Text>

          <View style={featStyles.metaRow}>
            <AvailabilityRing
              available={facility.availableSlots}
              total={facility.totalSlots}
              color={accent.primary}
            />
            <View style={featStyles.priceRow}>
              <Text style={featStyles.price}>₹{facility.pricePerSlot}</Text>
              <Text style={featStyles.priceUnit}>/hr</Text>
            </View>
          </View>

          <TouchableOpacity style={featStyles.cta} onPress={handlePress}>
            <Text style={featStyles.ctaText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={13} color="#000" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const featStyles = StyleSheet.create({
  card: {
    width: FEATURED_CARD_W,
    height: 220,
    borderRadius: 24,
    marginRight: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 18,
    justifyContent: 'space-between',
  },
  watermark: {
    position: 'absolute',
    right: -8,
    top: -8,
    fontSize: 100,
    opacity: 0.12,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topBadge: {
    backgroundColor: 'rgba(0,0,0,0.50)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  topBadgeText: { color: 'rgba(255,255,255,0.85)', fontSize: 9, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 1.5 },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.50)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: { color: '#fff', fontSize: 11, fontFamily: 'SpaceGrotesk_700Bold' },

  bottom: { gap: 6 },
  name: { color: '#fff', fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.3 },
  addr: { color: 'rgba(255,255,255,0.72)', fontSize: 11 },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  price: { color: '#fff', fontSize: 18, fontFamily: 'SpaceGrotesk_700Bold' },
  priceUnit: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 2 },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 6,
  },
  ctaText: { color: '#000', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 12 },
});

// ─── List facility card ───────────────────────────────────────────────────────

function ListCard({ facility, onPress }: { facility: Facility; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const accent = SPORT_ACCENT_COLORS[facility.sport] ?? { primary: '#A78BFA', glow: '' };
  const sport = SPORTS.find((s) => s.id === facility.sport);

  const pct = facility.availableSlots / facility.totalSlots;
  const dotColor = pct > 0.5 ? '#22C55E' : pct > 0 ? '#F59E0B' : '#F43F5E';

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={listStyles.wrapper}>
      <Animated.View style={[listStyles.card, { transform: [{ scale: scaleAnim }] }]}>
        {/* Gradient left panel */}
        <LinearGradient
          colors={facility.imageGradient as [string, string]}
          style={listStyles.leftPanel}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={listStyles.panelEmoji}>{sport?.emoji}</Text>
          <Text style={listStyles.distText}>{facility.distance}</Text>
        </LinearGradient>

        {/* Main content */}
        <View style={listStyles.body}>
          <View style={listStyles.topRow}>
            <Text style={listStyles.name} numberOfLines={1}>{facility.name}</Text>
            <View style={listStyles.ratingChip}>
              <Text style={listStyles.ratingChipText}>⭐ {facility.rating}</Text>
            </View>
          </View>

          <Text style={listStyles.addr} numberOfLines={1}>
            <Ionicons name="location-outline" size={10} color="#6B7FA0" /> {facility.address}
          </Text>

          {/* Tags */}
          <View style={listStyles.tagsRow}>
            <View style={[listStyles.tag, { borderColor: accent.primary + '50', backgroundColor: accent.primary + '12' }]}>
              <Text style={[listStyles.tagText, { color: accent.primary }]}>₹{facility.pricePerSlot}/hr</Text>
            </View>
            <View style={listStyles.tag}>
              <Text style={listStyles.tagText}>{sport?.label}</Text>
            </View>
          </View>

          {/* Bottom row */}
          <View style={listStyles.bottomRow}>
            <View style={listStyles.availRow}>
              <PulseDot color={dotColor} size={7} />
              <Text style={[listStyles.availText, { color: dotColor }]}>
                {facility.availableSlots} slots open
              </Text>
            </View>
            <TouchableOpacity
              style={[listStyles.bookBtn, { backgroundColor: accent.primary }]}
              onPress={handlePress}
            >
              <Text style={listStyles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const listStyles = StyleSheet.create({
  wrapper: { marginHorizontal: 20, marginBottom: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#181B2E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  leftPanel: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  panelEmoji: { fontSize: 26 },
  distText: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 0.5 },

  body: { flex: 1, padding: 14, gap: 5 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: '#EAEFFF', fontSize: 15, fontFamily: 'SpaceGrotesk_700Bold', flex: 1 },
  ratingChip: {
    backgroundColor: '#252840',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38405E',
  },
  ratingChipText: { color: '#EAEFFF', fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold' },
  addr: { color: '#6B7FA0', fontSize: 11 },

  tagsRow: { flexDirection: 'row', gap: 6, marginTop: 2 },
  tag: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#38405E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#252840',
  },
  tagText: { color: '#EAEFFF', fontSize: 10 },

  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  availText: { fontSize: 11, fontFamily: 'SpaceGrotesk_600SemiBold' },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  bookBtnText: { color: '#fff', fontSize: 12, fontFamily: 'SpaceGrotesk_700Bold' },
});

// ─── Discovery Screen ─────────────────────────────────────────────────────────

export default function DiscoveryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedSport, selectSport, selectFacility } = useBookingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Header shrink on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const filteredFacilities = FACILITIES.filter((f) => {
    const matchesSport = !selectedSport?.id || f.sport === selectedSport.id;
    const matchesSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  // Featured = top-rated facilities
  const featured = [...FACILITIES]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const handleSelectSport = useCallback(
    (sport: Sport) => {
      if (selectedSport?.id === sport.id) {
        selectSport({ id: '' as any, label: '', emoji: '' });
      } else {
        selectSport(sport);
      }
    },
    [selectedSport, selectSport]
  );

  const handleBook = useCallback(
    (facility: Facility) => {
      if (!selectedSport || selectedSport.id !== facility.sport) {
        const sportObj = SPORTS.find((s) => s.id === facility.sport);
        if (sportObj) selectSport(sportObj);
      }
      selectFacility(facility);
      router.push('/slot-selection');
    },
    [selectedSport, selectSport, selectFacility, router]
  );

  const totalAvailableSlots = FACILITIES.reduce((sum, f) => sum + f.availableSlots, 0);

  return (
    <View style={styles.container}>
      {/* ── Ambient top glow ── */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      {/* ── Sticky compact header ── */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top + 12 },
          { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.tagline}>Find. Book. Play.</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn}>
          <LinearGradient colors={['#A78BFA', '#7C3AED']} style={styles.avatarGradient}>
            <Text style={styles.avatarText}>DK</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Main scroll ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        {/* Hero spacer so content starts below header */}
        <View style={{ height: insets.top + 78 }} />

        {/* ── Stats cards ── */}
        <View style={styles.statsRow}>
          <GlassStatCard value={FACILITIES.length} label="Venues" icon="🏟️" color="#A78BFA" />
          <GlassStatCard value={totalAvailableSlots} label="Open Slots" icon="⏰" color="#5EEAD4" />
          <GlassStatCard value={420} label="Members" icon="👥" color="#FCD34D" />
        </View>

        {/* ── Search bar ── */}
        <View style={[styles.searchRow, searchFocused && styles.searchRowFocused]}>
          <Ionicons
            name="search-outline"
            size={17}
            color={searchFocused ? '#A78BFA' : '#6B7FA0'}
            style={{ marginLeft: 14 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues, courts..."
            placeholderTextColor="#6B7FA0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 12 }}>
              <Ionicons name="close-circle" size={16} color="#6B7FA0" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Step progress ── */}
        <View style={styles.stepRow}>
          {['Sport', 'Slot', 'Checkout', 'Gate Pass'].map((step, i) => (
            <React.Fragment key={step}>
              <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
                <Text style={[styles.stepNum, i === 0 && styles.stepNumActive]}>{i + 1}</Text>
              </View>
              {i < 3 && (
                <View style={[styles.stepLine, i === 0 && styles.stepLineActive]}>
                  {i === 0 && <View style={styles.stepLineFill} />}
                </View>
              )}
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.stepLabel}>Step 1 of 4 — Choose Your Sport</Text>

        {/* ── Sport FABs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportsRow}
        >
          {SPORTS.map((sport) => (
            <SportIconButton
              key={sport.id}
              sport={sport}
              isSelected={selectedSport?.id === sport.id}
              isAvailable={FACILITIES.some((f) => f.sport === sport.id && f.availableSlots > 0)}
              onPress={() => handleSelectSport(sport)}
            />
          ))}
        </ScrollView>

        {/* ── Featured carousel (only when no filter active) ── */}
        {!selectedSport?.id && !searchQuery && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccentDot} />
                <Text style={styles.sectionTitle}>Featured Venues</Text>
              </View>
              <Text style={styles.sectionSub}>Top-rated near you</Text>
            </View>

            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(f) => f.id + '-feat'}
              contentContainerStyle={styles.carouselRow}
              renderItem={({ item }) => (
                <FeaturedCard facility={item} onPress={() => handleBook(item)} />
              )}
              snapToInterval={FEATURED_CARD_W + 14}
              decelerationRate="fast"
              snapToAlignment="start"
            />
          </>
        )}

        {/* ── All / filtered list ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccentDot, { backgroundColor: '#5EEAD4' }]} />
            <Text style={styles.sectionTitle}>
              {selectedSport?.id ? `${selectedSport.label} Venues` : 'All Venues'}
            </Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filteredFacilities.length}</Text>
          </View>
        </View>

        {filteredFacilities.map((facility) => (
          <ListCard key={facility.id} facility={facility} onPress={() => handleBook(facility)} />
        ))}

        {filteredFacilities.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No venues found</Text>
            <Text style={styles.emptySubtext}>Try a different sport or search</Text>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => { setSearchQuery(''); selectSport({ id: '' as any, label: '', emoji: '' }); }}
            >
              <Text style={styles.clearBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0E1A' },

  ambientGlow: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: SCREEN_WIDTH + 120,
    height: 300,
    borderRadius: 300,
    backgroundColor: '#7C3AED',
    opacity: 0.07,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 14,
    zIndex: 10,
  },
  headerLeft: {},
  greeting: { color: '#8FA3C0', fontSize: 13, fontFamily: 'Inter_400Regular', letterSpacing: 0.2 },
  tagline: { color: '#EAEFFF', fontSize: 26, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.8, marginTop: 2 },
  avatarBtn: { marginTop: 4 },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  avatarText: { color: '#fff', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, letterSpacing: 0.5 },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 18,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181B2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    marginHorizontal: 20,
    marginBottom: 22,
    height: 50,
  },
  searchRowFocused: {
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  searchInput: {
    flex: 1,
    color: '#EAEFFF',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    paddingHorizontal: 12,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 5,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1E2130',
    borderWidth: 1,
    borderColor: '#38405E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#A78BFA',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  stepNum: { color: '#6B7FA0', fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold' },
  stepNumActive: { color: '#fff' },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#252840',
    marginHorizontal: 4,
    borderRadius: 1,
    overflow: 'hidden',
  },
  stepLineActive: {},
  stepLineFill: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%', backgroundColor: '#7C3AED', borderRadius: 1 },
  stepLabel: { color: '#6B7FA0', fontSize: 11, fontFamily: 'Inter_400Regular', letterSpacing: 0.3, paddingHorizontal: 24, marginBottom: 18 },

  sportsRow: { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 4 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccentDot: { width: 4, height: 18, borderRadius: 2, backgroundColor: '#A78BFA' },
  sectionTitle: { color: '#EAEFFF', fontSize: 18, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.3 },
  sectionSub: { color: '#6B7FA0', fontSize: 12, fontFamily: 'Inter_400Regular' },
  countBadge: {
    backgroundColor: '#7C3AED20',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7C3AED50',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: { color: '#A78BFA', fontSize: 12, fontFamily: 'SpaceGrotesk_700Bold' },

  carouselRow: { paddingLeft: 24, paddingRight: 10, marginBottom: 28 },

  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 52, marginBottom: 14 },
  emptyText: { color: '#EAEFFF', fontSize: 18, fontFamily: 'SpaceGrotesk_700Bold' },
  emptySubtext: { color: '#8FA3C0', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 6, textAlign: 'center' },
  clearBtn: {
    marginTop: 20,
    backgroundColor: '#7C3AED20',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7C3AED60',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  clearBtnText: { color: '#A78BFA', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 13 },
});
