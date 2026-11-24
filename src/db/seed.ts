/**
 * Demo data loaded the first time the app opens, so judges and new users see a
 * realistic group trip right away. Dates are relative to today so countdowns
 * and the "completed trip" always make sense whenever the app is demoed.
 */

import type { SQLiteDatabase } from 'expo-sqlite';

import type { PhotoKey } from '@/constants/photos';
import type { ExpenseCategory, ItineraryCategory } from '@/models/types';
import { addDays, toIsoDate } from '@/utils/dates';

import { createId, MEMBER_COLORS } from './ids';

type SeedTrip = {
  destination: string;
  country: string;
  startOffset: number;
  nights: number;
  budget: number;
  cover: PhotoKey;
  friends: string[];
  plans: [day: number, time: string | null, title: string, category: ItineraryCategory, location?: string][];
  expenses: [title: string, amount: number, paidBy: string, category: ExpenseCategory, split: string[] | 'all'][];
  messages: [author: string, body: string, hoursAgo: number][];
  checklist: [title: string, assignee: string | null, done: boolean][];
};

const FRIENDS = ['Jordan Ellis', 'Priya Nair', 'Sam Okafor', 'Lena Fischer'];
const YOU = 'you';

const TRIPS: SeedTrip[] = [
  {
    destination: 'Kyoto',
    country: 'Japan',
    startOffset: 25,
    nights: 9,
    budget: 6000,
    cover: 'kyoto',
    friends: ['Jordan Ellis', 'Priya Nair', 'Sam Okafor'],
    plans: [
      [0, '15:00', 'Land at Kansai, Haruka express to Kyoto', 'transport', 'Kansai Airport'],
      [0, '17:00', 'Check in at Gion guesthouse', 'stay', 'Gion'],
      [0, '19:30', 'Dinner on Pontocho Alley', 'food', 'Pontocho'],
      [1, '07:30', 'Fushimi Inari sunrise hike', 'activity', 'Fushimi Inari Taisha'],
      [1, '12:30', 'Lunch at Nishiki Market', 'food', 'Nishiki Market'],
      [2, '08:00', 'Arashiyama bamboo grove', 'activity', 'Arashiyama'],
      [4, '09:00', 'Day trip to Nara deer park', 'activity', 'Nara'],
    ],
    expenses: [
      ['Gion guesthouse (9 nights)', 1280, YOU, 'lodging', 'all'],
      ['Rail passes', 560, 'Jordan Ellis', 'transport', 'all'],
      ['Tea ceremony booking', 180, 'Priya Nair', 'activities', [YOU, 'Priya Nair', 'Sam Okafor']],
    ],
    messages: [
      ['Jordan Ellis', 'Booked the rail passes for everyone! Vouchers are in my email.', 52],
      ['Priya Nair', 'Can we add a day trip to Nara? The deer park looks amazing 🦌', 30],
      ['Sam Okafor', 'I’m in. I’ll check train times from Kyoto Station.', 29],
      [YOU, 'Added Nara to day 5 of the itinerary. Don’t forget your passports!', 6],
    ],
    checklist: [
      ['Passports', YOU, true],
      ['Rail pass vouchers', 'Jordan Ellis', true],
      ['Pocket Wi-Fi rental', 'Sam Okafor', false],
      ['Yen cash for markets', 'Priya Nair', false],
      ['Travel adapters', null, false],
    ],
  },
  {
    destination: 'Banff National Park',
    country: 'Canada',
    startOffset: 81,
    nights: 4,
    budget: 2400,
    cover: 'banff',
    friends: ['Lena Fischer'],
    plans: [
      [0, '14:00', 'Pick up rental car in Calgary', 'transport', 'Calgary Airport'],
      [1, '06:30', 'Moraine Lake sunrise', 'activity', 'Moraine Lake'],
      [2, '10:00', 'Johnston Canyon ice walk', 'activity', 'Johnston Canyon'],
    ],
    expenses: [['Cabin deposit', 450, 'Lena Fischer', 'lodging', 'all']],
    messages: [['Lena Fischer', 'Cabin is booked! It has a hot tub 🙌', 70]],
    checklist: [
      ['Parks Canada pass', YOU, false],
      ['Winter jackets', null, false],
    ],
  },
  {
    destination: 'Lisbon',
    country: 'Portugal',
    startOffset: 130,
    nights: 7,
    budget: 4500,
    cover: 'lisbon',
    friends: ['Priya Nair', 'Jordan Ellis'],
    plans: [[1, '10:00', 'Ride Tram 28 through Alfama', 'activity', 'Alfama']],
    expenses: [],
    messages: [['Priya Nair', 'Starting a list of pastry shops to try 🥐', 120]],
    checklist: [['Book apartment', YOU, false]],
  },
  {
    destination: 'New York City',
    country: 'United States',
    startOffset: -95,
    nights: 4,
    budget: 2000,
    cover: 'new-york',
    friends: ['Sam Okafor', 'Jordan Ellis'],
    plans: [
      [0, '18:00', 'Broadway show', 'activity', 'Theater District'],
      [1, '09:00', 'Walk the Brooklyn Bridge', 'activity', 'Brooklyn Bridge'],
      [2, '13:00', 'Pizza crawl in Greenwich Village', 'food', 'Greenwich Village'],
    ],
    expenses: [
      ['Hotel (4 nights)', 980, YOU, 'lodging', 'all'],
      ['Broadway tickets', 420, 'Sam Okafor', 'activities', 'all'],
      ['Subway passes', 102, 'Jordan Ellis', 'transport', 'all'],
      ['Group dinners', 356.5, YOU, 'food', 'all'],
    ],
    messages: [['Sam Okafor', 'Best trip ever. Uploading photos tonight!', 24 * 88]],
    checklist: [
      ['Show tickets', 'Sam Okafor', true],
      ['Hotel confirmation', YOU, true],
    ],
  },
];

/** Inserts the demo trips for the device owner (`youId`). Runs in one transaction. */
export async function seedDemoData(db: SQLiteDatabase, youId: string): Promise<void> {
  const today = toIsoDate(new Date());
  const now = Date.now();

  await db.withTransactionAsync(async () => {
    const memberIds = new Map<string, string>([[YOU, youId]]);
    for (const [i, name] of FRIENDS.entries()) {
      const id = createId('mem');
      memberIds.set(name, id);
      const email = `${name.split(' ')[0]!.toLowerCase()}@example.com`;
      await db.runAsync(
        'INSERT INTO members (id, name, email, color) VALUES (?, ?, ?, ?)',
        id,
        name,
        email,
        MEMBER_COLORS[(i + 1) % MEMBER_COLORS.length]!,
      );
    }
    const idOf = (name: string) => memberIds.get(name)!;

    for (const trip of TRIPS) {
      const tripId = createId('trip');
      const start = addDays(today, trip.startOffset);
      const end = addDays(start, trip.nights);
      const everyone = [youId, ...trip.friends.map(idOf)];

      await db.runAsync(
        `INSERT INTO trips (id, destination, country, start_date, end_date, budget_cents, cover, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        tripId,
        trip.destination,
        trip.country,
        start,
        end,
        trip.budget * 100,
        trip.cover,
        youId,
        new Date(now - 14 * 86_400_000).toISOString(),
      );
      for (const memberId of everyone) {
        await db.runAsync(
          'INSERT INTO trip_members (trip_id, member_id, role) VALUES (?, ?, ?)',
          tripId,
          memberId,
          memberId === youId ? 'organizer' : 'traveler',
        );
      }

      for (const [day, time, title, category, location] of trip.plans) {
        await db.runAsync(
          `INSERT INTO itinerary_items (id, trip_id, title, day, time, location, notes, category, created_by)
           VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
          createId('plan'),
          tripId,
          title,
          addDays(start, day),
          time,
          location ?? null,
          category,
          youId,
        );
      }

      for (const [index, [title, amount, paidBy, category, split]] of trip.expenses.entries()) {
        const expenseId = createId('exp');
        const spentOn = trip.startOffset < 0 ? addDays(start, Math.min(index, trip.nights)) : addDays(today, -(index + 2));
        await db.runAsync(
          `INSERT INTO expenses (id, trip_id, title, amount_cents, paid_by, category, spent_on, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          expenseId,
          tripId,
          title,
          Math.round(amount * 100),
          idOf(paidBy),
          category,
          spentOn,
          new Date(now - (index + 1) * 3_600_000).toISOString(),
        );
        const splitIds = split === 'all' ? everyone : split.map(idOf);
        for (const memberId of splitIds) {
          await db.runAsync('INSERT INTO expense_splits (expense_id, member_id) VALUES (?, ?)', expenseId, memberId);
        }
      }

      for (const [author, body, hoursAgo] of trip.messages) {
        await db.runAsync(
          'INSERT INTO messages (id, trip_id, author_id, body, created_at) VALUES (?, ?, ?, ?, ?)',
          createId('msg'),
          tripId,
          idOf(author),
          body,
          new Date(now - hoursAgo * 3_600_000).toISOString(),
        );
      }

      for (const [index, [title, assignee, done]] of trip.checklist.entries()) {
        await db.runAsync(
          'INSERT INTO checklist_items (id, trip_id, title, assignee_id, done, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          createId('chk'),
          tripId,
          title,
          assignee ? idOf(assignee) : null,
          done ? 1 : 0,
          new Date(now - (20 - index) * 3_600_000).toISOString(),
        );
      }
    }
  });
}
