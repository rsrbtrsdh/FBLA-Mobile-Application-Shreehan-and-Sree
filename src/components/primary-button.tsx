import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

import { Icon, type IconName } from './icon';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  /** "solid" sits on light backgrounds, "inverted" sits on the brand color. */
  variant?: 'solid' | 'inverted';
};

export function PrimaryButton({ label, onPress, icon, variant = 'solid' }: PrimaryButtonProps) {
  const inverted = variant === 'inverted';
  const foreground = inverted ? Colors.primary : Colors.textOnPrimary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        inverted ? styles.inverted : styles.solid,
        pressed && styles.pressed,
      ]}>
      {icon && <Icon name={icon} size={18} color={foreground} />}
      <Text style={[styles.label, { color: foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  solid: {
    backgroundColor: Colors.primary,
  },
  inverted: {
    backgroundColor: Colors.surface,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
