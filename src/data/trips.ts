/**
 * Sample data used until a real backend is added.
 * Dates are ISO calendar dates (YYYY-MM-DD) and are parsed in local time.
 */

export type Traveler = {
  id: string;
  name: string;
  color: string;
};

export type Trip = {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  travelers: Traveler[];
  plansConfirmed: number;
  plansTotal: number;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  category: 'Beaches' | 'Mountains' | 'Cities';
  rating: number;
  imageUrl: string;
};

export const currentUser = {
  firstName: 'Maya',
  fullName: 'Maya Chen',
  homeCity: 'San Francisco, CA',
  avatarColor: '#3D5AFE',
  stats: { trips: 14, countries: 9, friends: 26 },
};

const unsplash = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?w=${width}&q=75&auto=format&fit=crop`;

const people = {
  maya: { id: 'u1', name: 'Maya Chen', color: '#3D5AFE' },
  jordan: { id: 'u2', name: 'Jordan Ellis', color: '#FF6B4A' },
  priya: { id: 'u3', name: 'Priya Nair', color: '#14B8A6' },
  sam: { id: 'u4', name: 'Sam Okafor', color: '#F59E0B' },
  lena: { id: 'u5', name: 'Lena Fischer', color: '#A855F7' },
} satisfies Record<string, Traveler>;

export const upcomingTrips: Trip[] = [
  {
    id: 't1',
    destination: 'Kyoto',
    country: 'Japan',
    startDate: '2026-12-18',
    endDate: '2026-12-27',
    imageUrl: unsplash('photo-1493976040374-85c8e12f0c0e'),
    travelers: [people.maya, people.jordan, people.priya, people.sam],
    plansConfirmed: 9,
    plansTotal: 12,
  },
  {
    id: 't2',
    destination: 'Banff National Park',
    country: 'Canada',
    startDate: '2027-02-12',
    endDate: '2027-02-16',
    imageUrl: unsplash('photo-1503614472-8c93d56e92ce'),
    travelers: [people.maya, people.lena],
    plansConfirmed: 4,
    plansTotal: 10,
  },
  {
    id: 't3',
    destination: 'Lisbon',
    country: 'Portugal',
    startDate: '2027-04-02',
    endDate: '2027-04-09',
    imageUrl: unsplash('photo-1585208798174-6cedd86e019a'),
    travelers: [people.maya, people.priya, people.jordan],
    plansConfirmed: 2,
    plansTotal: 11,
  },
];

export const popularDestinations: Destination[] = [
  {
    id: 'd1',
    name: 'Santorini',
    country: 'Greece',
    category: 'Beaches',
    rating: 4.9,
    imageUrl: unsplash('photo-1570077188670-e3a8d69ac5ff', 600),
  },
  {
    id: 'd2',
    name: 'Bali',
    country: 'Indonesia',
    category: 'Beaches',
    rating: 4.8,
    imageUrl: unsplash('photo-1537996194471-e657df975ab4', 600),
  },
  {
    id: 'd3',
    name: 'Paris',
    country: 'France',
    category: 'Cities',
    rating: 4.7,
    imageUrl: unsplash('photo-1502602898657-3e91760cbb34', 600),
  },
  {
    id: 'd4',
    name: 'Swiss Alps',
    country: 'Switzerland',
    category: 'Mountains',
    rating: 4.9,
    imageUrl: unsplash('photo-1530122037265-a5f1f91d3b99', 600),
  },
  {
    id: 'd5',
    name: 'New York',
    country: 'United States',
    category: 'Cities',
    rating: 4.6,
    imageUrl: unsplash('photo-1496442226666-8d4d0e62e6e9', 600),
  },
  {
    id: 'd6',
    name: 'Reykjavík',
    country: 'Iceland',
    category: 'Mountains',
    rating: 4.8,
    imageUrl: unsplash('photo-1504893524553-b855bce32c67', 600),
  },
];
