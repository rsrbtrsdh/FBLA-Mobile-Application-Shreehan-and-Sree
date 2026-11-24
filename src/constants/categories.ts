import type { IconName } from '@/components/icon';
import type { ExpenseCategory, ItineraryCategory } from '@/models/types';

export const ITINERARY_CATEGORIES: { key: ItineraryCategory; label: string; icon: IconName }[] = [
  { key: 'activity', label: 'Activity', icon: 'ticket' },
  { key: 'food', label: 'Food', icon: 'food' },
  { key: 'transport', label: 'Transport', icon: 'car' },
  { key: 'stay', label: 'Stay', icon: 'bed' },
];

export const EXPENSE_CATEGORIES: { key: ExpenseCategory; label: string; icon: IconName; color: string }[] = [
  { key: 'lodging', label: 'Lodging', icon: 'bed', color: '#3D5AFE' },
  { key: 'food', label: 'Food', icon: 'food', color: '#FF6B4A' },
  { key: 'transport', label: 'Transport', icon: 'car', color: '#14B8A6' },
  { key: 'activities', label: 'Activities', icon: 'ticket', color: '#A855F7' },
  { key: 'other', label: 'Other', icon: 'money', color: '#64748B' },
];

export function itineraryIcon(category: ItineraryCategory): IconName {
  return ITINERARY_CATEGORIES.find((c) => c.key === category)?.icon ?? 'ticket';
}

export function expenseCategory(category: ExpenseCategory) {
  return EXPENSE_CATEGORIES.find((c) => c.key === category) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]!;
}
