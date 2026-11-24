import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { itineraryIcon } from '@/constants/categories';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { deleteItineraryItem } from '@/data/trip-repository';
import type { ItineraryItem, TripDetail } from '@/models/types';
import { confirmAction } from '@/utils/confirm';
import { daysBetween, formatDayHeading, formatTime, tripDays } from '@/utils/dates';

export function ItinerarySection({ detail }: { detail: TripDetail }) {
  const db = useSQLiteContext();
  const { trip, itinerary, members } = detail;
  const days = tripDays(trip.startDate, trip.endDate);
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name.split(' ')[0] ?? 'Someone';

  const onDelete = async (item: ItineraryItem) => {
    if (await confirmAction('Remove plan?', `“${item.title}” will be removed for everyone.`, 'Remove')) {
      await deleteItineraryItem(db, item.id);
    }
  };

  return (
    <View>
      <PrimaryButton
        label="Add a plan"
        icon="plus"
        onPress={() => router.push({ pathname: '/trip/[id]/add-plan', params: { id: trip.id } })}
      />
      <View style={styles.spacer} />

      {itinerary.length === 0 && (
        <EmptyState
          icon="itinerary"
          title="No plans yet"
          message="Add flights, hotel check-ins, tours and dinners so the whole group sees the schedule."
        />
      )}

      {days.map((day) => {
        const items = itinerary.filter((i) => i.day === day);
        if (items.length === 0) return null;
        return (
          <View key={day} style={styles.day}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayNumber}>Day {daysBetween(trip.startDate, day) + 1}</Text>
              <Text style={Typography.headline}>{formatDayHeading(day)}</Text>
            </View>
            {items.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.timeCol}>
                  <Text style={styles.time}>{item.time ? formatTime(item.time) : 'Any time'}</Text>
                </View>
                <View style={styles.iconWrap}>
                  <Icon name={itineraryIcon(item.category)} size={16} color={Colors.primary} />
                </View>
                <View style={styles.itemText}>
                  <Text style={Typography.body}>{item.title}</Text>
                  {item.location && <Text style={Typography.callout}>{item.location}</Text>}
                  {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
                  <Text style={styles.addedBy}>Added by {nameOf(item.createdBy)}</Text>
                </View>
                <Pressable
                  onPress={() => onDelete(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.title}`}
                  hitSlop={10}>
                  <Icon name="trash" size={16} color={Colors.textSecondary} />
                </Pressable>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  spacer: {
    height: Spacing.lg,
  },
  day: {
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  dayHeader: {
    gap: 2,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  timeCol: {
    width: 64,
    paddingTop: 2,
  },
  time: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  notes: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 2,
  },
  addedBy: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
