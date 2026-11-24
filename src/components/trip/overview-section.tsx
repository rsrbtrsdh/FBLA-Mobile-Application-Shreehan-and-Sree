import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Card } from '@/components/card';
import { Icon, type IconName } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { SectionHeader } from '@/components/section-header';
import { ShareButtons } from '@/components/share-buttons';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { deleteTrip, removeTraveler } from '@/data/trip-repository';
import type { Member, TripDetail } from '@/models/types';
import { tripInviteMessage, tripRecapMessage } from '@/services/social-share';
import { confirmAction, showNotice } from '@/utils/confirm';
import { formatDayHeading, formatTime, toIsoDate, tripStatus } from '@/utils/dates';
import { formatMoney } from '@/utils/money';

type Props = { detail: TripDetail; me: Member; onNavigate: (section: 'plan' | 'budget' | 'lists') => void };

export function OverviewSection({ detail, me, onNavigate }: Props) {
  const db = useSQLiteContext();
  const { trip, members, itinerary, expenses, checklist } = detail;
  const spent = expenses.reduce((sum, e) => sum + e.amountCents, 0);
  const done = checklist.filter((c) => c.done).length;
  const completed = tripStatus(trip.startDate, trip.endDate) === 'completed';
  const today = toIsoDate(new Date());
  const nextPlan = itinerary.find((p) => p.day >= today);
  const isOrganizer = members.some((m) => m.id === me.id && m.role === 'organizer');

  const onRemove = async (memberId: string, name: string) => {
    if (!(await confirmAction(`Remove ${name}?`, `${name} will no longer be part of this trip.`, 'Remove'))) return;
    try {
      await removeTraveler(db, trip.id, memberId);
    } catch (e) {
      showNotice('Can’t remove traveler', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  const onDelete = async () => {
    const ok = await confirmAction(
      `Delete ${trip.destination}?`,
      'This permanently deletes the trip and its plans, expenses, messages and lists from this device.',
    );
    if (!ok) return;
    await deleteTrip(db, trip.id);
    router.replace('/');
  };

  return (
    <View>
      {completed && (
        <Card style={styles.recap}>
          <View style={styles.recapRow}>
            <Icon name="celebrate" size={22} color={Colors.success} />
            <Text style={Typography.headline}>Trip complete!</Text>
          </View>
          <Text style={Typography.callout}>
            {members.length} travelers, {itinerary.length} plans and {formatMoney(spent)} in shared costs. Check the
            Budget tab to settle up.
          </Text>
        </Card>
      )}

      <View style={styles.stats}>
        <Stat
          icon="wallet"
          label="Budget used"
          value={formatMoney(spent)}
          detail={trip.budgetCents ? `of ${formatMoney(trip.budgetCents)}` : 'No budget set'}
          progress={trip.budgetCents ? spent / trip.budgetCents : undefined}
          onPress={() => onNavigate('budget')}
        />
        <Stat
          icon="itinerary"
          label="Plans"
          value={String(itinerary.length)}
          detail="on the itinerary"
          onPress={() => onNavigate('plan')}
        />
        <Stat
          icon="checklist"
          label="Checklist"
          value={`${done}/${checklist.length}`}
          detail="items done"
          progress={checklist.length ? done / checklist.length : undefined}
          onPress={() => onNavigate('lists')}
        />
      </View>

      {nextPlan && !completed && (
        <Card>
          <Text style={Typography.overline}>Up next</Text>
          <Text style={[Typography.headline, styles.nextTitle]}>{nextPlan.title}</Text>
          <Text style={Typography.callout}>
            {formatDayHeading(nextPlan.day)}
            {nextPlan.time ? ` · ${formatTime(nextPlan.time)}` : ''}
            {nextPlan.location ? ` · ${nextPlan.location}` : ''}
          </Text>
        </Card>
      )}

      <SectionHeader
        title="Travelers"
        count={members.length}
        actionLabel="Invite"
        onActionPress={() => router.push({ pathname: '/trip/[id]/invite', params: { id: trip.id } })}
      />
      <Card style={styles.members}>
        {members.map((member, index) => (
          <View key={member.id} style={[styles.memberRow, index > 0 && styles.memberDivider]}>
            <Avatar name={member.name} color={member.color} size={38} />
            <View style={styles.memberText}>
              <Text style={Typography.body}>
                {member.name}
                {member.id === me.id ? ' (you)' : ''}
              </Text>
              <Text style={Typography.caption}>{member.role === 'organizer' ? 'Organizer' : member.email ?? 'Traveler'}</Text>
            </View>
            {isOrganizer && member.role !== 'organizer' && (
              <Pressable
                onPress={() => onRemove(member.id, member.name)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${member.name} from trip`}
                hitSlop={10}>
                <Icon name="close" size={14} color={Colors.textSecondary} />
              </Pressable>
            )}
          </View>
        ))}
      </Card>

      {completed ? (
        <ShareButtons
          title="Share your trip recap"
          description="Post a quick recap of the trip to your socials."
          buildMessage={() => tripRecapMessage(trip, members, spent, itinerary.length)}
        />
      ) : (
        <ShareButtons
          title="Invite the group"
          description="Send the trip details to your group chat or post them on social media."
          buildMessage={() => tripInviteMessage(trip, members, me.id)}
        />
      )}

      {isOrganizer && <PrimaryButton label="Delete trip" icon="trash" variant="danger" onPress={onDelete} />}
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
  detail,
  progress,
  onPress,
}: {
  icon: IconName;
  label: string;
  value: string;
  detail: string;
  progress?: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value} ${detail}`}
      style={({ pressed }) => [styles.stat, pressed && styles.pressed]}>
      <Icon name={icon} size={18} color={Colors.primary} />
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={Typography.caption} numberOfLines={2}>
        {detail}
      </Text>
      {progress !== undefined && (
        <ProgressBar progress={progress} height={4} accessibilityLabel={`${label} ${Math.round(progress * 100)} percent`} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  recap: {
    backgroundColor: Colors.successSoft,
    gap: Spacing.xs,
  },
  recapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  stat: {
    flex: 1,
    gap: 4,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  nextTitle: {
    marginTop: Spacing.xs,
    marginBottom: 2,
  },
  members: {
    paddingVertical: Spacing.xs,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  memberDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  memberText: {
    flex: 1,
    gap: 2,
  },
});
