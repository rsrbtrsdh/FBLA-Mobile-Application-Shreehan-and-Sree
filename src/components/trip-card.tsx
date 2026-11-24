import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PHOTOS } from '@/constants/photos';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import type { TripSummary } from '@/models/types';
import { formatDateRange, nightsBetween, tripCountdown, tripStatus } from '@/utils/dates';
import { formatMoney } from '@/utils/money';

import { AvatarStack } from './avatar';
import { Icon } from './icon';
import { ProgressBar } from './progress-bar';

type TripCardProps = {
  trip: TripSummary;
  onPress?: () => void;
};

export function TripCard({ trip, onPress }: TripCardProps) {
  const nights = nightsBetween(trip.startDate, trip.endDate);
  const status = tripStatus(trip.startDate, trip.endDate);
  const completed = status === 'completed';
  const budgetProgress = trip.budgetCents > 0 ? trip.spentCents / trip.budgetCents : 0;
  const travelerLabel = `${trip.members.length} ${trip.members.length === 1 ? 'traveler' : 'travelers'}`;
  const dates = formatDateRange(trip.startDate, trip.endDate);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${trip.destination}, ${trip.country}. ${dates}. ${tripCountdown(trip.startDate, trip.endDate)}. ${travelerLabel}.`}
      accessibilityHint="Opens the trip"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image source={PHOTOS[trip.cover].image} style={styles.image} contentFit="cover" transition={200} />
        <View style={[styles.badge, completed && styles.badgeDone]}>
          <Icon name={completed ? 'checkCircle' : 'plane'} size={12} color={completed ? Colors.success : Colors.primary} />
          <Text style={styles.badgeText}>{tripCountdown(trip.startDate, trip.endDate)}</Text>
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
          <Icon name="chevronRight" size={14} color={Colors.textSecondary} />
        </View>

        <View style={styles.metaRow}>
          <Icon name="calendar" size={13} color={Colors.textSecondary} />
          <Text style={Typography.callout}>
            {dates} · {nights} {nights === 1 ? 'night' : 'nights'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.travelers}>
            <AvatarStack people={trip.members} />
            <Text style={Typography.caption}>{travelerLabel}</Text>
          </View>

          <View style={styles.progressBlock}>
            <Text style={Typography.caption}>
              {formatMoney(trip.spentCents)} of {formatMoney(trip.budgetCents)}
            </Text>
            <ProgressBar
              progress={budgetProgress}
              width={96}
              accessibilityLabel={`Budget used: ${Math.round(budgetProgress * 100)} percent`}
            />
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
    height: 160,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  badgeDone: {
    backgroundColor: Colors.successSoft,
  },
  badgeText: {
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
});
