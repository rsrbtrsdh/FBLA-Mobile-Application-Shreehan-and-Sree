import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, ScreenPadding, Spacing } from '@/constants/theme';

type ScreenProps = {
  children: ReactNode;
};

/**
 * Scrollable page shell: safe-area aware at the top, app background color,
 * standard side padding, and a max width so the web build stays phone-shaped.
 */
export function Screen({ children }: ScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: ScreenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
});
