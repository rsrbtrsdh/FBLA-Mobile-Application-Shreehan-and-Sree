import { router } from 'expo-router';

import { CreateTripCard } from '@/components/create-trip-card';
import { EmptyState } from '@/components/empty-state';
import { HomeHeader } from '@/components/home-header';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { TripCard } from '@/components/trip-card';
import { useCurrentUser, useTripSummaries } from '@/hooks/use-app-data';

export default function HomeScreen() {
  const user = useCurrentUser();
  const { active, past, status } = useTripSummaries();

  if (status === 'loading' || !user.data) return <Screen>{null}</Screen>;

  return (
    <Screen>
      <HomeHeader name={user.data.name} avatarColor={user.data.color} />

      <CreateTripCard onCreatePress={() => router.push('/create-trip')} />

      <SectionHeader title="Upcoming Trips" count={active.length} />
      {active.length === 0 ? (
        <EmptyState
          icon="luggage"
          title="No trips planned yet"
          message="Tap Create Trip above, or pick a destination in Explore to get started."
        />
      ) : (
        active.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onPress={() => router.push({ pathname: '/trip/[id]', params: { id: trip.id } })}
          />
        ))
      )}

      {past.length > 0 && (
        <>
          <SectionHeader title="Past Trips" count={past.length} />
          {past.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => router.push({ pathname: '/trip/[id]', params: { id: trip.id } })}
            />
          ))}
        </>
      )}
    </Screen>
  );
}
