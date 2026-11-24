import { DefaultTheme, Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect, useSyncExternalStore } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Logo } from '@/components/logo';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { DATABASE_NAME, migrateDatabase } from '@/db/schema';

SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
  },
};

/** The database only exists on the device, so nothing data-driven renders on the web server. */
const noopSubscribe = () => () => {};

function useIsClient() {
  // false while the web server renders HTML, true once running on the device/browser.
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export default function RootLayout() {
  const isClient = useIsClient();

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="dark" />
      {isClient ? (
        <Suspense fallback={<LoadingScreen />}>
          <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDatabase} useSuspense>
            <AppNavigator />
          </SQLiteProvider>
        </Suspense>
      ) : (
        <LoadingScreen />
      )}
    </ThemeProvider>
  );
}

function AppNavigator() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="trip/[id]" />
      <Stack.Screen name="create-trip" options={{ presentation: 'modal' }} />
      <Stack.Screen name="trip/[id]/add-plan" options={{ presentation: 'modal' }} />
      <Stack.Screen name="trip/[id]/add-expense" options={{ presentation: 'modal' }} />
      <Stack.Screen name="trip/[id]/invite" options={{ presentation: 'modal' }} />
      <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
      <Stack.Screen name="help" />
      <Stack.Screen name="credits" />
    </Stack>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loading} accessibilityLabel="Loading TripSync">
      <Logo size={88} />
    </View>
  );
}

/** Shown instead of a crash if any screen throws, with a way to recover. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  // On the web, the database file can only be open in one browser tab at a time.
  const otherTab = /Access Handle|createSyncAccessHandle/i.test(error.message);

  return (
    <View style={styles.error}>
      <Logo size={64} />
      <Text style={[Typography.title, styles.center]}>
        {otherTab ? 'TripSync is open in another tab' : 'Something went wrong'}
      </Text>
      <Text style={[Typography.body, styles.errorText]}>
        {otherTab
          ? 'Close the other TripSync tab, then tap Try again. Your trips are saved safely.'
          : 'TripSync hit an unexpected problem. Your saved trips are safe on this device.'}
      </Text>
      <Text style={[Typography.caption, styles.center]} selectable>
        {error.message}
      </Text>
      <PrimaryButton label="Try again" onPress={retry} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xxl,
    gap: Spacing.lg,
    backgroundColor: Colors.background,
    alignItems: 'stretch',
  },
  center: {
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: Colors.textSecondary,
  },
});
