import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, ScreenPadding, Spacing, Typography } from '@/constants/theme';

import { IconButton } from './icon-button';
import { PrimaryButton } from './primary-button';

type FormScreenProps = {
  title: string;
  subtitle?: string;
  submitLabel: string;
  onSubmit: () => void;
  submitting?: boolean;
  children: ReactNode;
};

export function closeScreen(fallback: '/' = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

/** Shared layout for every form: header with close button, scrolling fields, pinned submit button. */
export function FormScreen({ title, subtitle, submitLabel, onSubmit, submitting, children }: FormScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={Typography.title} accessibilityRole="header">
              {title}
            </Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <IconButton icon="close" accessibilityLabel="Close" size={40} onPress={() => closeScreen()} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>{children}</View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.inner}>
            <PrimaryButton label={submitting ? 'Saving…' : submitLabel} onPress={onSubmit} disabled={submitting} />
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingHorizontal: ScreenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: ScreenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  footer: {
    paddingHorizontal: ScreenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});
