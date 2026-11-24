import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { shareTo, SOCIAL_TARGETS } from '@/services/social-share';
import { showNotice } from '@/utils/confirm';

type ShareButtonsProps = {
  title: string;
  description: string;
  /** Built lazily so the message always reflects the latest data. */
  buildMessage: () => string;
};

/** A row of one-tap share buttons for WhatsApp, X, Facebook and the system share sheet. */
export function ShareButtons({ title, description, buildMessage }: ShareButtonsProps) {
  const onShare = async (target: (typeof SOCIAL_TARGETS)[number]) => {
    try {
      await shareTo(target.key, buildMessage());
    } catch {
      showNotice('Couldn’t share', `${target.label} isn’t available on this device.`);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={Typography.headline}>{title}</Text>
      <Text style={[Typography.callout, styles.description]}>{description}</Text>
      <View style={styles.row}>
        {SOCIAL_TARGETS.map((target) => (
          <Pressable
            key={target.key}
            onPress={() => onShare(target)}
            accessibilityRole="button"
            accessibilityLabel={target.key === 'system' ? 'Share with another app' : `Share on ${target.label}`}
            style={({ pressed }) => [styles.button, { backgroundColor: target.color }, pressed && styles.pressed]}>
            <Text style={[styles.label, { color: target.textColor }]}>{target.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  description: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  button: {
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
});
