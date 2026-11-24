import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PHOTOS } from '@/constants/photos';
import { Colors, Radius, ScreenPadding, Spacing } from '@/constants/theme';
import type { Trip } from '@/models/types';
import { formatDateRange, nightsBetween, tripCountdown } from '@/utils/dates';

export function TripHero({ trip }: { trip: Trip }) {
  const insets = useSafeAreaInsets();
  const nights = nightsBetween(trip.startDate, trip.endDate);

  return (
    <View style={styles.hero}>
      <Image source={PHOTOS[trip.cover].image} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.scrim} />

      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        accessibilityRole="button"
        accessibilityLabel="Back to trips"
        hitSlop={8}
        style={[styles.back, { top: insets.top + Spacing.sm }]}>
        <Icon name="back" size={18} color={Colors.text} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{tripCountdown(trip.startDate, trip.endDate)}</Text>
        </View>
        <Text style={styles.title} accessibilityRole="header">
          {trip.destination}
        </Text>
        <Text style={styles.meta}>
          {trip.country} · {formatDateRange(trip.startDate, trip.endDate)} · {nights}{' '}
          {nights === 1 ? 'night' : 'nights'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 280,
    justifyContent: 'flex-end',
    backgroundColor: Colors.text,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
  },
  back: {
    position: 'absolute',
    left: ScreenPadding,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: ScreenPadding,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginBottom: Spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: Colors.textOnPrimary,
  },
  meta: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.92)',
  },
});
