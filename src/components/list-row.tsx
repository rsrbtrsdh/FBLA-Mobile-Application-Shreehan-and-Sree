import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

import { Icon, type IconName } from './icon';

type ListRowProps = {
  icon: IconName;
  label: string;
  detail?: string;
  onPress?: () => void;
  /** Hides the divider under the last row in a group. */
  isLast?: boolean;
};

/** iOS Settings-style row used inside a ListGroup. */
export function ListRow({ icon, label, detail, onPress, isLast = false }: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={17} color={Colors.primary} />
      </View>
      <View style={[styles.content, !isLast && styles.divider]}>
        <Text style={styles.label}>{label}</Text>
        {detail && <Text style={styles.detail}>{detail}</Text>}
        <Icon name="chevronRight" size={13} color={Colors.textTertiary} />
      </View>
    </Pressable>
  );
}

export function ListGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.lg,
  },
  pressed: {
    backgroundColor: Colors.surfaceMuted,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 15,
    paddingRight: Spacing.lg,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  detail: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
