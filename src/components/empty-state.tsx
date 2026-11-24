import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

import { Icon, type IconName } from './icon';

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
  children?: React.ReactNode;
};

/** Friendly placeholder that also tells the user what to do next. */
export function EmptyState({ icon, title, message, children }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={26} color={Colors.primary} />
      </View>
      <Text style={[Typography.headline, styles.center]}>{title}</Text>
      <Text style={[Typography.callout, styles.center]}>{message}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xxl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  center: {
    textAlign: 'center',
  },
});
