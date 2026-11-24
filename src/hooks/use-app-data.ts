/**
 * View-model hooks: each screen asks for exactly the data it renders.
 * Screens stay free of SQL and business rules (MVVM: View -> ViewModel -> Repository).
 */

import { getCurrentUser, isOnboardingComplete } from '@/data/settings-repository';
import { getTripDetail, listTripSummaries } from '@/data/trip-repository';
import type { TripSummary } from '@/models/types';
import { tripStatus } from '@/utils/dates';

import { useQuery } from './use-query';

export function useOnboardingStatus() {
  return useQuery('onboarding', isOnboardingComplete);
}

export function useCurrentUser() {
  return useQuery('current-user', getCurrentUser);
}

export function useTripSummaries() {
  const query = useQuery('trip-summaries', listTripSummaries);
  const trips = query.data ?? [];
  const active = trips.filter((t) => tripStatus(t.startDate, t.endDate) !== 'completed');
  const past = trips
    .filter((t) => tripStatus(t.startDate, t.endDate) === 'completed')
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
  return { ...query, active, past, all: trips };
}

export function useTripDetail(tripId: string) {
  return useQuery(`trip:${tripId}`, (db) => getTripDetail(db, tripId));
}

/** Travel stats shown on the Profile tab, computed from saved trips. */
export function travelStats(trips: TripSummary[], userId: string | undefined) {
  const countries = new Set(trips.map((t) => t.country.toLowerCase()));
  const buddies = new Set(trips.flatMap((t) => t.members.map((m) => m.id)).filter((id) => id !== userId));
  return { trips: trips.length, countries: countries.size, buddies: buddies.size };
}
