import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

/** The TripSync app icon, reused inside the app so the brand is consistent. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={{ width: size, height: size, borderRadius: size * 0.24 }}
      accessibilityLabel="TripSync logo"
    />
  );
}

/** Logo plus the app name, used in headers. */
export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="TripSync">
      <Logo size={size} />
      <Text style={[styles.text, { fontSize: size * 0.68 }]}>
        Trip<Text style={styles.accent}>Sync</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '800',
    letterSpacing: -0.4,
    color: Colors.text,
  },
  accent: {
    color: Colors.primary,
  },
});
