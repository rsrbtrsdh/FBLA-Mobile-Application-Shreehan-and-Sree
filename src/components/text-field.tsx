import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string;
  hint?: string;
  /** Shown before the input, e.g. "$". */
  prefix?: string;
};

/**
 * Labeled input with an inline error. Screen readers hear the label, the hint
 * and the error, and errors are announced as soon as they appear.
 */
export function TextField({ label, error, hint, prefix, multiline, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label} nativeID={`${label}-label`}>
        {label}
      </Text>
      <View style={[styles.inputWrap, multiline && styles.multilineWrap, error ? styles.inputError : null]}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          {...inputProps}
          multiline={multiline}
          accessibilityLabel={label}
          accessibilityHint={hint}
          aria-invalid={Boolean(error)}
          placeholderTextColor={Colors.textTertiary}
          style={[styles.input, multiline && styles.multiline]}
        />
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
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
    gap: 6,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  multilineWrap: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerSoft,
  },
  prefix: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: Spacing.md,
  },
  multiline: {
    minHeight: 72,
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.danger,
  },
  hint: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
