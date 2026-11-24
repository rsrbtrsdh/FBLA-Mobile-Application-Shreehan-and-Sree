/**
 * Social media integration. TripSync hands a ready-to-send message directly to
 * WhatsApp, X and Facebook (opening the installed app when there is one, or the
 * website otherwise), and to the phone's share sheet for every other app
 * (Instagram, Messages, Snapchat, email...).
 */

import { Linking, Platform, Share } from 'react-native';

import type { Expense, Trip, TripMember } from '@/models/types';
import { formatDateRange, nightsBetween } from '@/utils/dates';
import { computeBalances, computeSettlements, formatMoney } from '@/utils/money';

/** Public web version of TripSync, included in shared messages. */
export const APP_URL = 'https://fbla-team-shreehan-and-sree.expo.app';

export type SocialTarget = 'whatsapp' | 'x' | 'facebook' | 'system';

export const SOCIAL_TARGETS: { key: SocialTarget; label: string; color: string; textColor: string }[] = [
  { key: 'whatsapp', label: 'WhatsApp', color: '#1FAF54', textColor: '#FFFFFF' },
  { key: 'x', label: 'X', color: '#0F1419', textColor: '#FFFFFF' },
  { key: 'facebook', label: 'Facebook', color: '#1877F2', textColor: '#FFFFFF' },
  { key: 'system', label: 'More…', color: '#EEF1FF', textColor: '#3D5AFE' },
];

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function tripInviteMessage(trip: Trip, members: TripMember[], currentUserId: string): string {
  const others = members.filter((m) => m.id !== currentUserId).map((m) => m.name.split(' ')[0]!);
  const nights = nightsBetween(trip.startDate, trip.endDate);
  const crew = others.length ? ` with ${joinNames(others)}` : '';
  return (
    `✈️ We're going to ${trip.destination}, ${trip.country}! ` +
    `${formatDateRange(trip.startDate, trip.endDate)} (${nights} ${nights === 1 ? 'night' : 'nights'})${crew}. ` +
    `Planning it together on TripSync: ${APP_URL}`
  );
}

export function settleUpMessage(trip: Trip, members: TripMember[], expenses: Expense[]): string {
  const total = expenses.reduce((sum, e) => sum + e.amountCents, 0);
  const settlements = computeSettlements(computeBalances(members, expenses));
  const lines = settlements.length
    ? settlements.map((s) => `• ${s.from.name.split(' ')[0]} pays ${s.to.name.split(' ')[0]} ${formatMoney(s.amountCents, { alwaysShowCents: true })}`)
    : ['• Everyone is settled up 🎉'];
  return [`💸 ${trip.destination} trip expenses: ${formatMoney(total, { alwaysShowCents: true })} total`, ...lines, `Tracked with TripSync: ${APP_URL}`].join('\n');
}

export function tripRecapMessage(trip: Trip, members: TripMember[], spentCents: number, plansCount: number): string {
  return (
    `🌍 Just got back from ${trip.destination}, ${trip.country} with ${members.length} friends! ` +
    `${plansCount} plans, ${formatMoney(spentCents)} shared, zero arguments about who owes what. ` +
    `Planned with TripSync: ${APP_URL}`
  );
}

async function openFirstAvailable(urls: string[]): Promise<void> {
  for (const url of urls) {
    try {
      await Linking.openURL(url);
      return;
    } catch {
      // App not installed or scheme blocked: try the next (web) link.
    }
  }
  throw new Error('No app could open this link.');
}

/** Sends `message` to the chosen platform. Resolves `false` if the user cancelled. */
export async function shareTo(target: SocialTarget, message: string): Promise<boolean> {
  const text = encodeURIComponent(message);
  const isWeb = Platform.OS === 'web';

  switch (target) {
    case 'whatsapp':
      await openFirstAvailable(
        isWeb ? [`https://wa.me/?text=${text}`] : [`whatsapp://send?text=${text}`, `https://wa.me/?text=${text}`],
      );
      return true;
    case 'x':
      await openFirstAvailable([`https://twitter.com/intent/tweet?text=${text}`]);
      return true;
    case 'facebook':
      await openFirstAvailable([
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}&quote=${text}`,
      ]);
      return true;
    case 'system': {
      if (isWeb && typeof navigator !== 'undefined' && !('share' in navigator)) {
        // Desktop browsers without a share sheet: fall back to WhatsApp Web.
        await openFirstAvailable([`https://wa.me/?text=${text}`]);
        return true;
      }
      const result = await Share.share({ message });
      return result.action !== Share.dismissedAction;
    }
  }
}
