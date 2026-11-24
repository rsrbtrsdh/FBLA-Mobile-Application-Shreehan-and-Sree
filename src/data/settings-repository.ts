import type { SQLiteDatabase } from 'expo-sqlite';

import { createId, MEMBER_COLORS } from '@/db/ids';
import type { Member } from '@/models/types';

import { notifyDataChanged } from './change-events';

const KEYS = {
  currentUserId: 'current_user_id',
  onboardingComplete: 'onboarding_complete',
} as const;

async function getSetting(db: SQLiteDatabase, key: string): Promise<string | null> {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
  return row?.value ?? null;
}

async function setSetting(db: SQLiteDatabase, key: string, value: string): Promise<void> {
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value,
  );
}

export async function isOnboardingComplete(db: SQLiteDatabase): Promise<boolean> {
  return (await getSetting(db, KEYS.onboardingComplete)) === 'true';
}

export async function getCurrentUser(db: SQLiteDatabase): Promise<Member | null> {
  const id = await getSetting(db, KEYS.currentUserId);
  if (!id) return null;
  return db.getFirstAsync<Member>('SELECT id, name, email, color FROM members WHERE id = ?', id);
}

/** Creates the device owner's member record the first time the app is opened. */
export async function createCurrentUser(db: SQLiteDatabase, name: string): Promise<Member> {
  const member: Member = { id: createId('mem'), name, email: null, color: MEMBER_COLORS[0]! };
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'INSERT INTO members (id, name, email, color) VALUES (?, ?, ?, ?)',
      member.id,
      member.name,
      member.email,
      member.color,
    );
    await setSetting(db, KEYS.currentUserId, member.id);
  });
  notifyDataChanged();
  return member;
}

export async function completeOnboarding(db: SQLiteDatabase): Promise<void> {
  await setSetting(db, KEYS.onboardingComplete, 'true');
  notifyDataChanged();
}

export async function updateCurrentUserName(db: SQLiteDatabase, name: string): Promise<void> {
  const id = await getSetting(db, KEYS.currentUserId);
  if (!id) throw new Error('No current user.');
  await db.runAsync('UPDATE members SET name = ? WHERE id = ?', name, id);
  notifyDataChanged();
}

/** Deletes every saved row so the app starts fresh (used by "Reset app data"). */
export async function resetAllData(db: SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      DELETE FROM expense_splits;
      DELETE FROM expenses;
      DELETE FROM messages;
      DELETE FROM checklist_items;
      DELETE FROM itinerary_items;
      DELETE FROM trip_members;
      DELETE FROM trips;
      DELETE FROM members;
      DELETE FROM settings;
    `);
  });
  notifyDataChanged();
}
