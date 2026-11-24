import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { formatToday, greetingFor } from '@/utils/dates';

import { Avatar } from './avatar';
import { IconButton } from './icon-button';

type HomeHeaderProps = {
  firstName: string;
  fullName: string;
  avatarColor: string;
  hasNotifications?: boolean;
  onNotificationsPress?: () => void;
};

export function HomeHeader({
  firstName,
  fullName,
  avatarColor,
  hasNotifications = false,
  onNotificationsPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={Typography.overline}>{formatToday()}</Text>
        <View style={styles.actions}>
          <IconButton
            icon="bell"
            accessibilityLabel="Notifications"
            showBadge={hasNotifications}
            onPress={onNotificationsPress}
          />
          <Avatar name={fullName} color={avatarColor} size={44} />
        </View>
      </View>

      <Text style={Typography.largeTitle} accessibilityRole="header">
        {greetingFor()}, {firstName}
      </Text>
      <Text style={styles.subtitle}>Where are we headed next?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
