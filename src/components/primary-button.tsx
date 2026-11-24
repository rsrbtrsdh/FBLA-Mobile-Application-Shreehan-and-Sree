import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

import { Icon, type IconName } from './icon';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  /** "solid" sits on light backgrounds, "inverted" on the brand color, "secondary" is a quieter outline. */
  variant?: 'solid' | 'inverted' | 'secondary' | 'danger';
  disabled?: boolean;
  accessibilityHint?: string;
};

const VARIANTS = {
  solid: { background: Colors.primary, foreground: Colors.textOnPrimary, border: Colors.primary },
  inverted: { background: Colors.surface, foreground: Colors.primary, border: Colors.surface },
  secondary: { background: Colors.surface, foreground: Colors.primary, border: Colors.border },
  danger: { background: Colors.surface, foreground: Colors.danger, border: Colors.border },
} as const;

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'solid',
  disabled = false,
  accessibilityHint,
}: PrimaryButtonProps) {
  const colors = VARIANTS[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.background, borderColor: colors.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      {icon && <Icon name={icon} size={18} color={colors.foreground} />}
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
