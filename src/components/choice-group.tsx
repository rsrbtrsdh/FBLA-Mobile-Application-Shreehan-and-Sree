import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

import { Chip } from './chip';

type ChoiceGroupProps<K extends string> = {
  label: string;
  options: { key: K; label: string }[];
  /** One key for single choice, several for multi-select. */
  selected: K[];
  onToggle: (key: K) => void;
  error?: string;
  hint?: string;
};

/** Labeled set of chips for picking one or more options. */
export function ChoiceGroup<K extends string>({ label, options, selected, onToggle, error, hint }: ChoiceGroupProps<K>) {
  return (
    <View style={styles.container} accessibilityLabel={label}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => (
          <Chip
            key={option.key}
            label={option.label}
            selected={selected.includes(option.key)}
            onPress={() => onToggle(option.key)}
          />
        ))}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  error: {
    fontSize: 13,
    color: Colors.danger,
  },
  hint: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
