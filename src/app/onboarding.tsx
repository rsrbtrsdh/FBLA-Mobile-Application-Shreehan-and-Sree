import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { Logo } from '@/components/logo';
import { PrimaryButton } from '@/components/primary-button';
import { TextField } from '@/components/text-field';
import { Colors, MaxContentWidth, Radius, ScreenPadding, Spacing, Typography } from '@/constants/theme';
import { completeOnboarding, createCurrentUser } from '@/data/settings-repository';
import { seedDemoData } from '@/db/seed';
import { validateProfile } from '@/validation/forms';

const SLIDES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'itinerary',
    title: 'Plan it together',
    body: 'Build one shared day-by-day itinerary so everyone knows where to be and when.',
  },
  {
    icon: 'wallet',
    title: 'Split costs fairly',
    body: 'Log expenses as you go. TripSync tracks the budget and shows exactly who owes whom.',
  },
  {
    icon: 'chat',
    title: 'Stay in sync',
    body: 'Chat with the group, share packing lists, and send plans to WhatsApp, X or Facebook in one tap.',
  },
];

export default function OnboardingScreen() {
  const db = useSQLiteContext();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [withSamples, setWithSamples] = useState(true);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const isNameStep = step === SLIDES.length;
  const slide = SLIDES[step];

  const finish = async () => {
    const result = validateProfile({ name });
    if (!result.ok) {
      setError(result.errors.name);
      return;
    }
    setSaving(true);
    try {
      const me = await createCurrentUser(db, result.value.name);
      if (withSamples) await seedDemoData(db, me.id);
      await completeOnboarding(db);
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <View style={styles.topRow}>
              <Logo size={44} />
              {!isNameStep && (
                <Pressable onPress={() => setStep(SLIDES.length)} accessibilityRole="button" hitSlop={10}>
                  <Text style={styles.skip}>Skip</Text>
                </Pressable>
              )}
            </View>

            {slide ? (
              <View style={styles.slide}>
                <View style={styles.illustration}>
                  <Icon name={slide.icon} size={64} color={Colors.primary} />
                </View>
                <Text style={[Typography.largeTitle, styles.center]} accessibilityRole="header">
                  {slide.title}
                </Text>
                <Text style={[Typography.body, styles.body]}>{slide.body}</Text>
              </View>
            ) : (
              <View style={styles.slide}>
                <Text style={[Typography.largeTitle, styles.center]} accessibilityRole="header">
                  Welcome to TripSync
                </Text>
                <Text style={[Typography.body, styles.body]}>
                  What should your travel crew call you? Your name appears on plans, expenses and messages you add.
                </Text>
                <View style={styles.form}>
                  <TextField
                    label="Your name"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      setError(undefined);
                    }}
                    placeholder="e.g. Alex Kim"
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    returnKeyType="done"
                    onSubmitEditing={finish}
                    maxLength={40}
                    error={error}
                  />
                  <View style={styles.switchRow}>
                    <View style={styles.flex}>
                      <Text style={Typography.headline}>Add sample trips</Text>
                      <Text style={Typography.callout}>Explore TripSync with a ready-made group trip to Kyoto.</Text>
                    </View>
                    <Switch
                      value={withSamples}
                      onValueChange={setWithSamples}
                      accessibilityLabel="Add sample trips"
                      trackColor={{ true: Colors.primary, false: Colors.border }}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.dots} accessibilityLabel={`Step ${step + 1} of ${SLIDES.length + 1}`}>
              {[...SLIDES, null].map((_, i) => (
                <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
              ))}
            </View>

            {isNameStep ? (
              <PrimaryButton label={saving ? 'Setting up…' : 'Get started'} onPress={finish} disabled={saving} />
            ) : (
              <PrimaryButton label="Next" icon="arrowRight" onPress={() => setStep(step + 1)} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: ScreenPadding,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skip: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xxxl,
  },
  illustration: {
    width: 148,
    height: 148,
    borderRadius: 44,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  center: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    color: Colors.textSecondary,
    lineHeight: 22,
    maxWidth: 340,
  },
  form: {
    alignSelf: 'stretch',
    marginTop: Spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
});
