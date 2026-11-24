import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';

type SectionHeaderProps = {
  title: string;
  /** Optional count shown next to the title, e.g. the number of trips. */
  count?: number;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, count, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        <Text style={Typography.title} accessibilityRole="header">
          {title}
        </Text>
        {count !== undefined && (
          <View style={styles.count}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
      {actionLabel && (
        <Pressable onPress={onActionPress} hitSlop={8} accessibilityRole="button" accessibilityLabel={actionLabel}>
          {({ pressed }) => (
            <Text style={[styles.action, pressed && styles.pressed]}>{actionLabel}</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  count: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  action: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  pressed: {
    opacity: 0.5,
  },
});
