import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PHOTOS } from '@/constants/photos';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';
import type { Destination } from '@/data/destinations';

import { Icon } from './icon';

type DestinationCardProps = {
  destination: Destination;
  onPress?: () => void;
};

export function DestinationCard({ destination, onPress }: DestinationCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${destination.name}, ${destination.country}. ${destination.idealGroup}.`}
      accessibilityHint="Starts a new trip to this destination"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={PHOTOS[destination.photo].image} style={styles.image} contentFit="cover" transition={200} />
      <View style={styles.plan}>
        <Icon name="plus" size={11} color={Colors.primary} />
        <Text style={styles.planText}>Plan</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {destination.name}
        </Text>
        <Text style={styles.country} numberOfLines={1}>
          {destination.country}
        </Text>
        <Text style={styles.group} numberOfLines={1}>
          {destination.idealGroup}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.card,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceMuted,
  },
  plan: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  planText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  body: {
    padding: Spacing.md,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  country: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  group: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
});
