import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

import { Icon, type IconName } from './icon';

export type Segment<K extends string> = { key: K; label: string; icon?: IconName; badge?: number };

type SegmentedControlProps<K extends string> = {
  segments: Segment<K>[];
  value: K;
  onChange: (key: K) => void;
  accessibilityLabel: string;
};

/** Horizontally scrolling pill tabs, used for trip sections and category pickers. */
export function SegmentedControl<K extends string>({
  segments,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<K>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      contentContainerStyle={styles.row}>
      {segments.map((segment) => {
        const selected = segment.key === value;
        const color = selected ? Colors.textOnPrimary : Colors.textSecondary;
        return (
          <Pressable
            key={segment.key}
            onPress={() => onChange(segment.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={segment.badge ? `${segment.label}, ${segment.badge}` : segment.label}
            style={({ pressed }) => [
              styles.segment,
              selected ? styles.selected : styles.unselected,
              pressed && styles.pressed,
            ]}>
            {segment.icon && <Icon name={segment.icon} size={15} color={color} />}
            <Text style={[styles.label, { color }]}>{segment.label}</Text>
            {segment.badge ? (
              <View style={[styles.badge, selected && styles.badgeSelected]}>
                <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>{segment.badge}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
  },
  segment: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  unselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  badgeTextSelected: {
    color: Colors.textOnPrimary,
  },
});
