import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Shadows, Spacing } from '@/constants/theme';

import { Icon, type IconName } from './icon';

const TABS: { name: string; href: '/' | '/explore' | '/profile'; label: string; icon: IconName }[] = [
  { name: 'home', href: '/', label: 'Home', icon: 'home' },
  { name: 'explore', href: '/explore', label: 'Explore', icon: 'explore' },
  { name: 'profile', href: '/profile', label: 'Profile', icon: 'profile' },
];

/** Bottom tab navigation shared by iOS, Android and web. */
export default function AppTabs() {
  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <TabBar>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton icon={tab.icon} label={tab.label} />
            </TabTrigger>
          ))}
        </TabBar>
      </TabList>
    </Tabs>
  );
}

function TabBar({ children, style, ...props }: TabListProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, Spacing.md) }, style]}>
      {children}
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: IconName; label: string };

// `ref` is typed for a View, not a Pressable, so it is left off the Pressable.
function TabButton({ icon, label, isFocused, ref: _ref, ...props }: TabButtonProps) {
  const color = isFocused ? Colors.primary : Colors.textTertiary;

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slot: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    ...Shadows.bar,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: Spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
