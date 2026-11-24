import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';
import type { Destination } from '@/data/trips';

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
      accessibilityLabel={`${destination.name}, ${destination.country}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image
        source={{ uri: destination.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={250}
      />
      <View style={styles.rating}>
        <Icon name="star" size={11} color="#F59E0B" />
        <Text style={styles.ratingText}>{destination.rating.toFixed(1)}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {destination.name}
        </Text>
        <Text style={styles.country} numberOfLines={1}>
          {destination.country}
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
  rating: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
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
});
