import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Radius, ScreenPadding, Spacing, Typography } from '@/constants/theme';

/** Placeholder for the trip-creation flow, opened as a modal from Home. */
export default function CreateTripScreen() {
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={Typography.headline}>New Trip</Text>
        <IconButton icon="close" accessibilityLabel="Close" size={36} onPress={close} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconBadge}>
          <Icon name="plane" size={32} color={Colors.primary} />
        </View>
        <Text style={[Typography.title, styles.center]}>Trip planning is on the way</Text>
        <Text style={[Typography.body, styles.description]}>
          Soon you will be able to pick a destination, set dates, and invite your travel crew
          right here.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Back to Home" onPress={close} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ScreenPadding,
    paddingVertical: Spacing.md,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.md,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: ScreenPadding,
    paddingBottom: Spacing.lg,
  },
});
