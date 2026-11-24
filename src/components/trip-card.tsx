import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import type { Trip } from '@/data/trips';
import { formatDateRange, nightsBetween, tripCountdown } from '@/utils/dates';

import { AvatarStack } from './avatar';
import { Icon } from './icon';

type TripCardProps = {
  trip: Trip;
  onPress?: () => void;
};

export function TripCard({ trip, onPress }: TripCardProps) {
  const nights = nightsBetween(trip.startDate, trip.endDate);
  const progress = trip.plansTotal > 0 ? trip.plansConfirmed / trip.plansTotal : 0;
  const travelerLabel = `${trip.travelers.length} ${trip.travelers.length === 1 ? 'traveler' : 'travelers'}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${trip.destination}, ${trip.country}, ${formatDateRange(trip.startDate, trip.endDate)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: trip.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={250}
          placeholder={{ blurhash: 'L6Pj0^jE.AyE_3t7t7R**0o#DgR4' }}
        />
        <View style={styles.countdown}>
          <Icon name="plane" size={12} color={Colors.primary} />
          <Text style={styles.countdownText}>
            {tripCountdown(trip.startDate, trip.endDate)}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={Typography.headline} numberOfLines={1}>
              {trip.destination}
            </Text>
            <View style={styles.metaRow}>
              <Icon name="location" size={13} color={Colors.textSecondary} />
              <Text style={Typography.callout}>{trip.country}</Text>
            </View>
          </View>
          <Icon name="chevronRight" size={14} color={Colors.textTertiary} />
        </View>

        <View style={styles.metaRow}>
          <Icon name="calendar" size={13} color={Colors.textSecondary} />
          <Text style={Typography.callout}>
            {formatDateRange(trip.startDate, trip.endDate)} · {nights}{' '}
            {nights === 1 ? 'night' : 'nights'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.travelers}>
            <AvatarStack people={trip.travelers} />
            <Text style={Typography.caption}>{travelerLabel}</Text>
          </View>

          <View style={styles.progressBlock}>
            <Text style={Typography.caption}>
              {trip.plansConfirmed}/{trip.plansTotal} plans set
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  imageWrap: {
    height: 168,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  countdown: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  body: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleBlock: {
    flex: 1,
    gap: Spacing.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  travelers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBlock: {
    alignItems: 'flex-end',
    gap: 6,
  },
  progressTrack: {
    width: 96,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});
