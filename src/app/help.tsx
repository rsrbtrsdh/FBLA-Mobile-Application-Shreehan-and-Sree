import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Icon, type IconName } from '@/components/icon';
import { Logo } from '@/components/logo';
import { PageHeader } from '@/components/page-header';
import { Screen } from '@/components/screen';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

const STEPS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'plus',
    title: '1. Create a trip',
    body: 'Tap Create Trip on Home (or a destination in Explore). Enter where, when and your group budget.',
  },
  {
    icon: 'personAdd',
    title: '2. Add your travelers',
    body: 'In the trip’s Overview, tap Invite to add friends, or share the trip to WhatsApp, X or Facebook.',
  },
  {
    icon: 'itinerary',
    title: '3. Build the plan',
    body: 'Open Plan and add flights, check-ins, tours and dinners. Plans are grouped by day and time.',
  },
  {
    icon: 'wallet',
    title: '4. Track spending',
    body: 'In Budget, log each shared cost and who paid. TripSync splits it and shows who owes whom.',
  },
  {
    icon: 'chat',
    title: '5. Talk and organize',
    body: 'Use Chat for group decisions and Lists for packing and to-dos. Tap an avatar to assign a task.',
  },
  {
    icon: 'celebrate',
    title: '6. Wrap it up',
    body: 'After the trip it moves to Past Trips. Settle up and share a recap with your friends.',
  },
];

/** How each part of the FBLA "Together We Go" prompt is answered in the app. */
const PROMPT_MAP: { need: string; feature: string }[] = [
  { need: 'Collaboration', feature: 'Shared trips with travelers, roles and assigned checklist tasks' },
  { need: 'Communication', feature: 'Group chat per trip + one-tap sharing to WhatsApp, X and Facebook' },
  { need: 'Scheduling', feature: 'Day-by-day itinerary with times and clash detection' },
  { need: 'Budgeting', feature: 'Group budget, expense splitting, balances and settle-up' },
  { need: 'Organization', feature: 'Shared packing and to-do lists with progress' },
  { need: 'Trip management', feature: 'Countdown, planning → in progress → completed, trip recap' },
];

export default function HelpScreen() {
  return (
    <Screen>
      <PageHeader title="How to use TripSync" subtitle="Plan a group trip from the first idea to the final bill." />

      <Card style={styles.intro}>
        <Logo size={48} />
        <Text style={[Typography.callout, styles.flex]}>
          TripSync keeps your crew’s plans, money and conversations in one place, so nobody is left out of the loop.
        </Text>
      </Card>

      {STEPS.map((step) => (
        <View key={step.title} style={styles.step}>
          <View style={styles.stepIcon}>
            <Icon name={step.icon} size={18} color={Colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text style={Typography.headline}>{step.title}</Text>
            <Text style={[Typography.callout, styles.stepBody]}>{step.body}</Text>
          </View>
        </View>
      ))}

      <Text style={[Typography.title, styles.mapTitle]} accessibilityRole="header">
        Built for “Together We Go”
      </Text>
      <Text style={[Typography.callout, styles.mapIntro]}>
        How TripSync covers every part of the group trip planning challenge:
      </Text>
      <Card style={styles.table}>
        {PROMPT_MAP.map((row, i) => (
          <View key={row.need} style={[styles.tableRow, i > 0 && styles.divider]}>
            <Text style={styles.need}>{row.need}</Text>
            <Text style={[Typography.body, styles.flex]}>{row.feature}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={Typography.headline}>Tips</Text>
        <Text style={[Typography.callout, styles.tip]}>• Dates use the format YYYY-MM-DD, e.g. 2027-03-14.</Text>
        <Text style={[Typography.callout, styles.tip]}>• Times use 24-hour format, e.g. 18:30 for 6:30 PM.</Text>
        <Text style={[Typography.callout, styles.tip]}>
          • Everything is saved on your phone and works without internet. Sharing needs a connection.
        </Text>
        <Text style={[Typography.callout, styles.tip]}>
          • Works with VoiceOver/TalkBack and larger text sizes.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBody: {
    marginTop: 2,
    lineHeight: 20,
  },
  mapTitle: {
    marginTop: Spacing.lg,
  },
  mapIntro: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  table: {
    paddingVertical: Spacing.xs,
  },
  tableRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  need: {
    width: 116,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  tip: {
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
});
