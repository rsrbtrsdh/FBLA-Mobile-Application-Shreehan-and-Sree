import type { PhotoKey } from '@/constants/photos';

/** Curated destinations for the Explore tab. Tapping one starts a new trip there. */
export type Destination = {
  id: string;
  name: string;
  country: string;
  category: 'Beaches' | 'Mountains' | 'Cities';
  idealGroup: string;
  photo: PhotoKey;
};

export const DESTINATIONS: Destination[] = [
  { id: 'd1', name: 'Santorini', country: 'Greece', category: 'Beaches', idealGroup: 'Friends · 5–7 days', photo: 'santorini' },
  { id: 'd2', name: 'Bali', country: 'Indonesia', category: 'Beaches', idealGroup: 'Friends · 7–10 days', photo: 'bali' },
  { id: 'd3', name: 'Paris', country: 'France', category: 'Cities', idealGroup: 'Family · 4–6 days', photo: 'paris' },
  { id: 'd4', name: 'Swiss Alps', country: 'Switzerland', category: 'Mountains', idealGroup: 'Family · 5–8 days', photo: 'swiss-alps' },
  { id: 'd5', name: 'New York City', country: 'United States', category: 'Cities', idealGroup: 'Friends · 3–5 days', photo: 'new-york' },
  { id: 'd6', name: 'Reykjavík', country: 'Iceland', category: 'Mountains', idealGroup: 'Friends · 5–7 days', photo: 'iceland' },
];
