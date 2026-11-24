import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { ListGroup, ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { currentUser } from '@/data/trips';

const STATS = [
  { label: 'Trips', value: currentUser.stats.trips },
  { label: 'Countries', value: currentUser.stats.countries },
  { label: 'Friends', value: currentUser.stats.friends },
];

export default function ProfileScreen() {
  return (
    <Screen>
      <Text style={[Typography.largeTitle, styles.title]} accessibilityRole="header">
        Profile
      </Text>

      <View style={styles.card}>
        <Avatar name={currentUser.fullName} color={currentUser.avatarColor} size={76} />
        <Text style={[Typography.title, styles.name]}>{currentUser.fullName}</Text>
        <View style={styles.locationRow}>
          <Icon name="location" size={13} color={Colors.textSecondary} />
          <Text style={Typography.callout}>{currentUser.homeCity}</Text>
        </View>

        <View style={styles.stats}>
          {STATS.map((stat, index) => (
            <View key={stat.label} style={[styles.stat, index > 0 && styles.statDivider]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={Typography.caption}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={[Typography.overline, styles.groupLabel]}>Account</Text>
      <ListGroup>
        <ListRow icon="edit" label="Edit profile" />
        <ListRow icon="bell" label="Notifications" detail="On" />
        <ListRow icon="bookmark" label="Saved places" detail="18" isLast />
      </ListGroup>

      <Text style={[Typography.overline, styles.groupLabel]}>Support</Text>
      <ListGroup>
        <ListRow icon="settings" label="Preferences" />
        <ListRow icon="help" label="Help & feedback" isLast />
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
