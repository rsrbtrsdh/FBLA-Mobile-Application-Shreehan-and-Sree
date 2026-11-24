import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '@/components/chip';
import { DestinationCard } from '@/components/destination-card';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { Colors, Radius, ScreenPadding, Spacing, Typography } from '@/constants/theme';
import { DESTINATIONS, type Destination } from '@/data/destinations';
import { cleanText } from '@/validation/rules';

const CATEGORIES = ['All', 'Beaches', 'Mountains', 'Cities'] as const;
type Category = (typeof CATEGORIES)[number];

function chunkIntoRows<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function startTripTo(destination: Destination) {
  router.push({
    pathname: '/create-trip',
    params: { destination: destination.name, country: destination.country, cover: destination.photo },
  });
}

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');

  const results = useMemo(() => {
    const q = cleanText(query).toLowerCase();
    return DESTINATIONS.filter(
      (d) =>
        (category === 'All' || d.category === category) &&
        (q === '' || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)),
    );
  }, [query, category]);

  return (
    <Screen>
      <Text style={[Typography.largeTitle, styles.title]} accessibilityRole="header">
        Explore
      </Text>
      <Text style={styles.subtitle}>Group-friendly getaways. Tap one to start planning it.</Text>

      <View style={styles.search}>
        <Icon name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search destinations"
          placeholderTextColor={Colors.textTertiary}
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
          maxLength={40}
          accessibilityLabel="Search destinations"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroller}
        contentContainerStyle={styles.chips}>
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} selected={c === category} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>

      <SectionHeader title="Popular with groups" />
      {results.length === 0 ? (
        <Text style={styles.empty}>No destinations match “{cleanText(query)}”.</Text>
      ) : (
        chunkIntoRows(results, 2).map((row) => (
          <View key={row.map((d) => d.id).join('-')} style={styles.gridRow}>
            {row.map((d) => (
              <DestinationCard key={d.id} destination={d} onPress={() => startTripTo(d)} />
            ))}
            {row.length === 1 && <View style={styles.gridSpacer} />}
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.text,
  },
  chipsScroller: {
    marginHorizontal: -ScreenPadding,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  chips: {
    gap: Spacing.sm,
    paddingHorizontal: ScreenPadding,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  gridSpacer: {
    flex: 1,
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xxxl,
  },
});
