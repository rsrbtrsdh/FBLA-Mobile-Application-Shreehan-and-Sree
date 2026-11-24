import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PHOTO_KEYS, PHOTOS, type PhotoKey } from '@/constants/photos';
import { Colors, Radius, Spacing } from '@/constants/theme';

import { Icon } from './icon';

type PhotoPickerProps = {
  value: string;
  onChange: (key: PhotoKey) => void;
  error?: string;
};

/** Horizontal strip of bundled cover photos to choose from. */
export function PhotoPicker({ value, onChange, error }: PhotoPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cover photo</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PHOTO_KEYS.map((key) => {
          const selected = key === value;
          return (
            <Pressable
              key={key}
              onPress={() => onChange(key)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Cover photo: ${PHOTOS[key].label}`}
              style={[styles.thumb, selected && styles.selected]}>
              <Image source={PHOTOS[key].image} style={styles.image} contentFit="cover" />
              {selected && (
                <View style={styles.check}>
                  <Icon name="check" size={12} color={Colors.textOnPrimary} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
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
  row: {
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: Colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  check: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 13,
    color: Colors.danger,
  },
});
