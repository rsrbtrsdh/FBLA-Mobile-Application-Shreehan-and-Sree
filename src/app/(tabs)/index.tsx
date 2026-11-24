import { router } from 'expo-router';

import { CreateTripCard } from '@/components/create-trip-card';
import { HomeHeader } from '@/components/home-header';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { TripCard } from '@/components/trip-card';
import { currentUser, upcomingTrips } from '@/data/trips';

export default function HomeScreen() {
  return (
    <Screen>
      <HomeHeader
        firstName={currentUser.firstName}
        fullName={currentUser.fullName}
        avatarColor={currentUser.avatarColor}
        hasNotifications
      />

      <CreateTripCard onCreatePress={() => router.push('/create-trip')} />

      <SectionHeader title="Upcoming Trips" count={upcomingTrips.length} actionLabel="See all" />
      {upcomingTrips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </Screen>
  );
}
