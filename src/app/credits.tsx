import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { PageHeader } from '@/components/page-header';
import { Screen } from '@/components/screen';
import { PHOTO_KEYS, PHOTOS } from '@/constants/photos';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

/** Open-source libraries the app is built on, with their licenses. */
const LIBRARIES: { name: string; use: string; license: string }[] = [
  { name: 'React Native', use: 'Cross-platform mobile UI', license: 'MIT' },
  { name: 'Expo SDK 58', use: 'Build tooling and native modules', license: 'MIT' },
  { name: 'Expo Router', use: 'File-based navigation', license: 'MIT' },
  { name: 'expo-sqlite / SQLite', use: 'On-device database', license: 'MIT / Public domain' },
  { name: 'expo-image', use: 'Fast image rendering', license: 'MIT' },
  { name: 'expo-symbols', use: 'SF Symbols (iOS) and Material Symbols (Android)', license: 'MIT' },
  { name: 'Material Symbols', use: 'Icon font on Android and web', license: 'Apache 2.0' },
  { name: 'react-native-safe-area-context', use: 'Notch and home-indicator spacing', license: 'MIT' },
  { name: 'TypeScript', use: 'Type-checked source code', license: 'Apache 2.0' },
  { name: 'sharp (dev only)', use: 'Generates the app icon from SVG', license: 'Apache 2.0' },
];

export default function CreditsScreen() {
  return (
    <Screen>
      <PageHeader title="Credits & licenses" subtitle="Everything TripSync uses that we didn’t create ourselves." />

      <Text style={[Typography.overline, styles.label]}>Original work</Text>
      <Card>
        <Text style={Typography.body}>
          The TripSync name, logo, app icon, interface design and all source code were created by our team for the
          FBLA Mobile Application Development event (2026–2027).
        </Text>
      </Card>

      <Text style={[Typography.overline, styles.label]}>Open-source libraries</Text>
      <Card style={styles.list}>
        {LIBRARIES.map((lib, i) => (
          <View key={lib.name} style={[styles.row, i > 0 && styles.divider]}>
            <View style={styles.flex}>
              <Text style={Typography.body}>{lib.name}</Text>
              <Text style={Typography.caption}>{lib.use}</Text>
            </View>
            <Text style={styles.license}>{lib.license}</Text>
          </View>
        ))}
      </Card>

      <Text style={[Typography.overline, styles.label]}>Photos</Text>
      <Card style={styles.list}>
        <Text style={[Typography.callout, styles.photoIntro]}>
          Destination photos are from Unsplash and used under the Unsplash License (unsplash.com/license), which allows
          free use without permission.
        </Text>
        {PHOTO_KEYS.map((key, i) => (
          <View key={key} style={[styles.row, styles.divider, i === 0 && styles.firstPhoto]}>
            <Image source={PHOTOS[key].image} style={styles.thumb} contentFit="cover" />
            <View style={styles.flex}>
              <Text style={Typography.body}>{PHOTOS[key].label}</Text>
              <Text style={styles.source} selectable numberOfLines={1}>
                {PHOTOS[key].source.replace('https://', '')}
              </Text>
            </View>
          </View>
        ))}
      </Card>

      <Text style={[Typography.overline, styles.label]}>Trademarks</Text>
      <Card>
        <Text style={Typography.callout}>
          WhatsApp and Facebook are trademarks of Meta Platforms, Inc. X is a trademark of X Corp. They are named only to
          label the share buttons; TripSync is not affiliated with or endorsed by these companies.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  label: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  list: {
    paddingVertical: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  firstPhoto: {
    marginTop: Spacing.sm,
  },
  license: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  photoIntro: {
    paddingTop: Spacing.md,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
  },
  source: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
