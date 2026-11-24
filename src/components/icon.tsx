import { SymbolView } from 'expo-symbols';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * One icon name per concept, mapped to SF Symbols on iOS and
 * Material Symbols on Android and web.
 */
const ICONS = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  explore: { ios: 'safari.fill', android: 'explore', web: 'explore' },
  profile: { ios: 'person.crop.circle.fill', android: 'person', web: 'person' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  location: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  plane: { ios: 'airplane', android: 'flight', web: 'flight' },
  people: { ios: 'person.2.fill', android: 'group', web: 'group' },
  star: { ios: 'star.fill', android: 'star', web: 'star' },
  heart: { ios: 'heart', android: 'favorite', web: 'favorite' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
  help: { ios: 'questionmark.circle', android: 'help', web: 'help' },
  bookmark: { ios: 'bookmark', android: 'bookmark', web: 'bookmark' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  luggage: { ios: 'suitcase.rolling.fill', android: 'luggage', web: 'luggage' },
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 22, color = Colors.text, style }: IconProps) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} style={style} />;
}
