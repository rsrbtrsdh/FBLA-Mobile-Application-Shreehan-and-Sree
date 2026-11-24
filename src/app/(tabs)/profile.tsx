import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { ListGroup, ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { resetAllData } from '@/data/settings-repository';
import { travelStats, useCurrentUser, useTripSummaries } from '@/hooks/use-app-data';
import { confirmAction } from '@/utils/confirm';

export default function ProfileScreen() {
  const db = useSQLiteContext();
  const user = useCurrentUser();
  const { all } = useTripSummaries();

  if (!user.data) return <Screen>{null}</Screen>;
  const me = user.data;
  const stats = travelStats(all, me.id);

  const onReset = async () => {
    const ok = await confirmAction(
      'Reset TripSync?',
      'This permanently deletes every trip, expense, message and list saved on this device. It can’t be undone.',
      'Reset',
    );
    if (!ok) return;
    await resetAllData(db);
    router.replace('/onboarding');
  };

  return (
    <Screen>
      <Text style={[Typography.largeTitle, styles.title]} accessibilityRole="header">
        Profile
      </Text>

      <View style={styles.card}>
        <Avatar name={me.name} color={me.color} size={76} />
        <Text style={[Typography.title, styles.name]}>{me.name}</Text>
        <View style={styles.locationRow}>
          <Icon name="lock" size={12} color={Colors.textSecondary} />
          <Text style={Typography.callout}>Trips saved privately on this device</Text>
        </View>

        <View style={styles.stats}>
          {[
            { label: 'Trips', value: stats.trips },
            { label: 'Countries', value: stats.countries },
            { label: 'Travel buddies', value: stats.buddies },
          ].map((stat, index) => (
            <View
              key={stat.label}
              style={[styles.stat, index > 0 && styles.statDivider]}
              accessibilityLabel={`${stat.value} ${stat.label}`}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={Typography.caption}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={[Typography.overline, styles.groupLabel]}>Account</Text>
      <ListGroup>
        <ListRow icon="edit" label="Edit name" detail={me.name.split(' ')[0]} onPress={() => router.push('/edit-profile')} isLast />
      </ListGroup>

      <Text style={[Typography.overline, styles.groupLabel]}>About</Text>
      <ListGroup>
        <ListRow icon="help" label="How to use TripSync" onPress={() => router.push('/help')} />
        <ListRow icon="copyright" label="Credits & licenses" onPress={() => router.push('/credits')} isLast />
      </ListGroup>

      <Text style={[Typography.overline, styles.groupLabel]}>Data</Text>
      <ListGroup>
        <ListRow icon="refresh" label="Reset app data" onPress={onReset} isLast />
      </ListGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  card: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
    ...Shadows.card,
  },
  name: {
    marginTop: Spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  groupLabel: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
});
