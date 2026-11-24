import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { formatToday, greetingFor } from '@/utils/dates';

import { Avatar } from './avatar';
import { IconButton } from './icon-button';
import { Wordmark } from './logo';

type HomeHeaderProps = {
  name: string;
  avatarColor: string;
};

export function HomeHeader({ name, avatarColor }: HomeHeaderProps) {
  const firstName = name.split(' ')[0];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Wordmark />
        <View style={styles.actions}>
          <IconButton icon="help" accessibilityLabel="How to use TripSync" onPress={() => router.push('/help')} />
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Open your profile">
            <Avatar name={name} color={avatarColor} size={44} />
          </Pressable>
        </View>
      </View>

      <Text style={Typography.overline}>{formatToday()}</Text>
      <Text style={[Typography.largeTitle, styles.title]} accessibilityRole="header">
        {greetingFor()}, {firstName}
      </Text>
      <Text style={styles.subtitle}>Where is the crew headed next?</Text>
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
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    marginTop: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
