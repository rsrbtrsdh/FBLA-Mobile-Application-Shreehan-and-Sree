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
  arrowRight: { ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' },
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
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  checkCircle: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  circle: { ios: 'circle', android: 'radio_button_unchecked', web: 'radio_button_unchecked' },
  send: { ios: 'paperplane.fill', android: 'send', web: 'send' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  wallet: { ios: 'creditcard.fill', android: 'account_balance_wallet', web: 'account_balance_wallet' },
  chat: { ios: 'bubble.left.and.bubble.right.fill', android: 'forum', web: 'forum' },
  checklist: { ios: 'checklist', android: 'checklist', web: 'checklist' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  food: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  bed: { ios: 'bed.double.fill', android: 'hotel', web: 'hotel' },
  car: { ios: 'car.fill', android: 'directions_car', web: 'directions_car' },
  ticket: { ios: 'ticket.fill', android: 'confirmation_number', web: 'confirmation_number' },
  personAdd: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
  sparkles: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
  refresh: { ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' },
  overview: { ios: 'square.grid.2x2', android: 'dashboard', web: 'dashboard' },
  copyright: { ios: 'c.circle', android: 'copyright', web: 'copyright' },
  itinerary: { ios: 'list.bullet.rectangle', android: 'event_note', web: 'event_note' },
  celebrate: { ios: 'party.popper', android: 'celebration', web: 'celebration' },
  money: { ios: 'dollarsign.circle', android: 'payments', web: 'payments' },
  route: { ios: 'point.topleft.down.to.point.bottomright.curvepath', android: 'route', web: 'route' },
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
