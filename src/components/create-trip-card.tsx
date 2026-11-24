import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';

import { Icon } from './icon';
import { PrimaryButton } from './primary-button';

type CreateTripCardProps = {
  onCreatePress: () => void;
};

/** Brand-colored call to action that holds the main Create Trip button. */
export function CreateTripCard({ onCreatePress }: CreateTripCardProps) {
  return (
    <View style={styles.card}>
      {/* Decorative shapes give the flat brand color some depth. */}
      <View style={[styles.circle, styles.circleLarge]} />
      <View style={[styles.circle, styles.circleSmall]} />

      <View style={styles.iconBadge}>
        <Icon name="luggage" size={20} color={Colors.textOnPrimary} />
      </View>
      <Text style={styles.title}>Plan your next adventure</Text>
      <Text style={styles.subtitle}>
        Invite friends, build the itinerary together, and keep everyone in sync.
      </Text>

      <PrimaryButton
        label="Create Trip"
        icon="plus"
        variant="inverted"
        onPress={onCreatePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xxxl,
    ...Shadows.card,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
  },
  circleLarge: {
    width: 220,
    height: 220,
    top: -90,
    right: -60,
  },
  circleSmall: {
    width: 120,
    height: 120,
    top: 40,
    right: -40,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: Colors.textOnPrimary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: 'rgba(255, 255, 255, 0.82)',
    marginBottom: Spacing.md,
  },
});
