/**
 * Trip cover photos bundled with the app so it works fully offline.
 * All photos come from Unsplash (https://unsplash.com) and are used under the
 * Unsplash License (https://unsplash.com/license): free to use, no permission needed.
 * `source` is the original image URL, listed on the Credits screen and in the README.
 */

export const PHOTOS = {
  kyoto: {
    image: require('@/assets/images/photos/kyoto.jpg'),
    label: 'Kyoto, Japan',
    source: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
  },
  banff: {
    image: require('@/assets/images/photos/banff.jpg'),
    label: 'Moraine Lake, Banff',
    source: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce',
  },
  lisbon: {
    image: require('@/assets/images/photos/lisbon.jpg'),
    label: 'Lisbon tram',
    source: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a',
  },
  santorini: {
    image: require('@/assets/images/photos/santorini.jpg'),
    label: 'Santorini, Greece',
    source: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
  },
  bali: {
    image: require('@/assets/images/photos/bali.jpg'),
    label: 'Bali, Indonesia',
    source: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
  },
  paris: {
    image: require('@/assets/images/photos/paris.jpg'),
    label: 'Paris, France',
    source: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
  },
  'swiss-alps': {
    image: require('@/assets/images/photos/swiss-alps.jpg'),
    label: 'Swiss Alps',
    source: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99',
  },
  'new-york': {
    image: require('@/assets/images/photos/new-york.jpg'),
    label: 'New York City',
    source: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
  },
  iceland: {
    image: require('@/assets/images/photos/iceland.jpg'),
    label: 'Iceland',
    source: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67',
  },
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export const PHOTO_KEYS = Object.keys(PHOTOS) as PhotoKey[];

export function isPhotoKey(value: string): value is PhotoKey {
  return value in PHOTOS;
}
