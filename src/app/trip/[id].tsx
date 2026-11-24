import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { SegmentedControl, type Segment } from '@/components/segmented-control';
import { BudgetSection } from '@/components/trip/budget-section';
import { ChatSection } from '@/components/trip/chat-section';
import { ChecklistSection } from '@/components/trip/checklist-section';
import { ItinerarySection } from '@/components/trip/itinerary-section';
import { OverviewSection } from '@/components/trip/overview-section';
import { TripHero } from '@/components/trip/trip-hero';
import { Colors, MaxContentWidth, ScreenPadding, Spacing } from '@/constants/theme';
import { useCurrentUser, useTripDetail } from '@/hooks/use-app-data';

type SectionKey = 'overview' | 'plan' | 'budget' | 'chat' | 'lists';

export default function TripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useTripDetail(id);
  const me = useCurrentUser();
  const [section, setSection] = useState<SectionKey>('overview');

  if (detail.status === 'loading' || me.status === 'loading') return <View style={styles.screen} />;

  if (!detail.data || !me.data) {
    return (
      <View style={[styles.screen, styles.missing]}>
        <EmptyState icon="info" title="Trip not found" message="This trip may have been deleted.">
          <PrimaryButton label="Back to Home" onPress={() => router.replace('/')} />
        </EmptyState>
      </View>
    );
  }

  const data = detail.data;
  const segments: Segment<SectionKey>[] = [
    { key: 'overview', label: 'Overview', icon: 'overview' },
    { key: 'plan', label: 'Plan', icon: 'itinerary', badge: data.itinerary.length },
    { key: 'budget', label: 'Budget', icon: 'wallet' },
    { key: 'chat', label: 'Chat', icon: 'chat', badge: data.messages.length },
    { key: 'lists', label: 'Lists', icon: 'checklist', badge: data.checklist.filter((c) => !c.done).length },
  ];

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[1]}>
        <TripHero trip={data.trip} />
        <View style={styles.tabs}>
          <View style={styles.inner}>
            <SegmentedControl
              segments={segments}
              value={section}
              onChange={setSection}
              accessibilityLabel="Trip sections"
            />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.inner}>
            {section === 'overview' && <OverviewSection detail={data} me={me.data} onNavigate={setSection} />}
            {section === 'plan' && <ItinerarySection detail={data} />}
            {section === 'budget' && <BudgetSection detail={data} me={me.data} />}
            {section === 'chat' && <ChatSection detail={data} me={me.data} />}
            {section === 'lists' && <ChecklistSection detail={data} />}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  missing: {
    justifyContent: 'center',
    padding: ScreenPadding,
  },
  scroll: {
    paddingBottom: Spacing.xxxl,
  },
  tabs: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: ScreenPadding,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  body: {
    paddingHorizontal: ScreenPadding,
    paddingTop: Spacing.lg,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
