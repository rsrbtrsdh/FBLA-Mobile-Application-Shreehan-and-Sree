/**
 * Data access for trips and everything inside them. Screens never write SQL;
 * they call these functions (repository pattern). Every query uses `?`
 * placeholders, so user text is never pasted into SQL (prevents SQL injection).
 */

import type { SQLiteDatabase } from 'expo-sqlite';

import { isPhotoKey } from '@/constants/photos';
import { createId, MEMBER_COLORS, nowIso } from '@/db/ids';
import type {
  ChecklistItem,
  Expense,
  ExpenseCategory,
  ItineraryCategory,
  ItineraryItem,
  Message,
  Trip,
  TripDetail,
  TripMember,
  TripRole,
  TripSummary,
} from '@/models/types';

import { notifyDataChanged } from './change-events';

/* ------------------------------------------------------------- Row mapping */

type TripRow = {
  id: string;
  destination: string;
  country: string;
  start_date: string;
  end_date: string;
  budget_cents: number;
  cover: string;
  created_by: string;
  created_at: string;
};

function toTrip(row: TripRow): Trip {
  return {
    id: row.id,
    destination: row.destination,
    country: row.country,
    startDate: row.start_date,
    endDate: row.end_date,
    budgetCents: row.budget_cents,
    cover: isPhotoKey(row.cover) ? row.cover : 'kyoto',
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

type MemberRow = { id: string; name: string; email: string | null; color: string; role: TripRole; trip_id: string };

function toTripMember(row: MemberRow): TripMember {
  return { id: row.id, name: row.name, email: row.email, color: row.color, role: row.role };
}

const MEMBER_SELECT = `
  SELECT m.id, m.name, m.email, m.color, tm.role, tm.trip_id
  FROM trip_members tm JOIN members m ON m.id = tm.member_id`;

/* ------------------------------------------------------------------- Reads */

export async function listTripSummaries(db: SQLiteDatabase): Promise<TripSummary[]> {
  const rows = await db.getAllAsync<
    TripRow & { spent_cents: number; checklist_done: number; checklist_total: number; itinerary_count: number }
  >(`
    SELECT t.*,
      COALESCE((SELECT SUM(amount_cents) FROM expenses e WHERE e.trip_id = t.id), 0) AS spent_cents,
      (SELECT COUNT(*) FROM checklist_items c WHERE c.trip_id = t.id AND c.done = 1) AS checklist_done,
      (SELECT COUNT(*) FROM checklist_items c WHERE c.trip_id = t.id) AS checklist_total,
      (SELECT COUNT(*) FROM itinerary_items i WHERE i.trip_id = t.id) AS itinerary_count
    FROM trips t
    ORDER BY t.start_date ASC
  `);
  const memberRows = await db.getAllAsync<MemberRow>(`${MEMBER_SELECT} ORDER BY tm.role DESC, m.name`);

  return rows.map((row) => ({
    ...toTrip(row),
    members: memberRows.filter((m) => m.trip_id === row.id).map(toTripMember),
    spentCents: row.spent_cents,
    checklistDone: row.checklist_done,
    checklistTotal: row.checklist_total,
    itineraryCount: row.itinerary_count,
  }));
}

export async function getTripDetail(db: SQLiteDatabase, tripId: string): Promise<TripDetail | null> {
  const tripRow = await db.getFirstAsync<TripRow>('SELECT * FROM trips WHERE id = ?', tripId);
  if (!tripRow) return null;

  const [memberRows, itineraryRows, expenseRows, splitRows, messageRows, checklistRows] = await Promise.all([
    db.getAllAsync<MemberRow>(`${MEMBER_SELECT} WHERE tm.trip_id = ? ORDER BY tm.role DESC, m.name`, tripId),
    db.getAllAsync<{
      id: string;
      trip_id: string;
      title: string;
      day: string;
      time: string | null;
      location: string | null;
      notes: string | null;
      category: ItineraryCategory;
      created_by: string;
    }>('SELECT * FROM itinerary_items WHERE trip_id = ? ORDER BY day, time IS NULL, time', tripId),
    db.getAllAsync<{
      id: string;
      trip_id: string;
      title: string;
      amount_cents: number;
      paid_by: string;
      category: ExpenseCategory;
      spent_on: string;
    }>('SELECT * FROM expenses WHERE trip_id = ? ORDER BY spent_on DESC, created_at DESC', tripId),
    db.getAllAsync<{ expense_id: string; member_id: string }>(
      `SELECT s.expense_id, s.member_id FROM expense_splits s
       JOIN expenses e ON e.id = s.expense_id WHERE e.trip_id = ?`,
      tripId,
    ),
    db.getAllAsync<{ id: string; trip_id: string; author_id: string; body: string; created_at: string }>(
      'SELECT * FROM messages WHERE trip_id = ? ORDER BY created_at ASC',
      tripId,
    ),
    db.getAllAsync<{ id: string; trip_id: string; title: string; assignee_id: string | null; done: number }>(
      'SELECT * FROM checklist_items WHERE trip_id = ? ORDER BY done, created_at',
      tripId,
    ),
  ]);

  const itinerary: ItineraryItem[] = itineraryRows.map((r) => ({
    id: r.id,
    tripId: r.trip_id,
    title: r.title,
    day: r.day,
    time: r.time,
    location: r.location,
    notes: r.notes,
    category: r.category,
    createdBy: r.created_by,
  }));

  const expenses: Expense[] = expenseRows.map((r) => ({
    id: r.id,
    tripId: r.trip_id,
    title: r.title,
    amountCents: r.amount_cents,
    paidBy: r.paid_by,
    category: r.category,
    spentOn: r.spent_on,
    splitWith: splitRows.filter((s) => s.expense_id === r.id).map((s) => s.member_id),
  }));

  const messages: Message[] = messageRows.map((r) => ({
    id: r.id,
    tripId: r.trip_id,
    authorId: r.author_id,
    body: r.body,
    createdAt: r.created_at,
  }));

  const checklist: ChecklistItem[] = checklistRows.map((r) => ({
    id: r.id,
    tripId: r.trip_id,
    title: r.title,
    assigneeId: r.assignee_id,
    done: r.done === 1,
  }));

  return { trip: toTrip(tripRow), members: memberRows.map(toTripMember), itinerary, expenses, messages, checklist };
}

/* ------------------------------------------------------------------ Writes */

export type NewTrip = Omit<Trip, 'id' | 'createdAt' | 'createdBy'>;

export async function createTrip(db: SQLiteDatabase, input: NewTrip, organizerId: string): Promise<string> {
  const id = createId('trip');
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO trips (id, destination, country, start_date, end_date, budget_cents, cover, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.destination,
      input.country,
      input.startDate,
      input.endDate,
      input.budgetCents,
      input.cover,
      organizerId,
      nowIso(),
    );
    await db.runAsync(
      "INSERT INTO trip_members (trip_id, member_id, role) VALUES (?, ?, 'organizer')",
      id,
      organizerId,
    );
  });
  notifyDataChanged();
  return id;
}

export async function deleteTrip(db: SQLiteDatabase, tripId: string): Promise<void> {
  // ON DELETE CASCADE removes the trip's members, plans, expenses, messages and lists.
  await db.runAsync('DELETE FROM trips WHERE id = ?', tripId);
  notifyDataChanged();
}

export async function addTraveler(
  db: SQLiteDatabase,
  tripId: string,
  input: { name: string; email: string | null },
): Promise<void> {
  const used = await db.getAllAsync<{ color: string }>(`${MEMBER_SELECT} WHERE tm.trip_id = ?`, tripId);
  const color = MEMBER_COLORS.find((c) => !used.some((u) => u.color === c)) ?? MEMBER_COLORS[used.length % MEMBER_COLORS.length]!;
  const memberId = createId('mem');
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'INSERT INTO members (id, name, email, color) VALUES (?, ?, ?, ?)',
      memberId,
      input.name,
      input.email,
      color,
    );
    await db.runAsync(
      "INSERT INTO trip_members (trip_id, member_id, role) VALUES (?, ?, 'traveler')",
      tripId,
      memberId,
    );
  });
  notifyDataChanged();
}

export async function removeTraveler(db: SQLiteDatabase, tripId: string, memberId: string): Promise<void> {
  const used = await db.getFirstAsync<{ n: number }>(
    `SELECT
       (SELECT COUNT(*) FROM expenses WHERE trip_id = ? AND paid_by = ?) +
       (SELECT COUNT(*) FROM expense_splits s JOIN expenses e ON e.id = s.expense_id
          WHERE e.trip_id = ? AND s.member_id = ?) AS n`,
    tripId,
    memberId,
    tripId,
    memberId,
  );
  if ((used?.n ?? 0) > 0) {
    throw new Error('This traveler is part of shared expenses. Remove those expenses first.');
  }
  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE checklist_items SET assignee_id = NULL WHERE trip_id = ? AND assignee_id = ?', tripId, memberId);
    await db.runAsync("DELETE FROM trip_members WHERE trip_id = ? AND member_id = ? AND role = 'traveler'", tripId, memberId);
  });
  notifyDataChanged();
}

export async function addItineraryItem(
  db: SQLiteDatabase,
  tripId: string,
  input: Omit<ItineraryItem, 'id' | 'tripId' | 'createdBy'>,
  createdBy: string,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO itinerary_items (id, trip_id, title, day, time, location, notes, category, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    createId('plan'),
    tripId,
    input.title,
    input.day,
    input.time,
    input.location,
    input.notes,
    input.category,
    createdBy,
  );
  notifyDataChanged();
}

export async function deleteItineraryItem(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM itinerary_items WHERE id = ?', id);
  notifyDataChanged();
}

export async function addExpense(
  db: SQLiteDatabase,
  tripId: string,
  input: Omit<Expense, 'id' | 'tripId'>,
): Promise<void> {
  const id = createId('exp');
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO expenses (id, trip_id, title, amount_cents, paid_by, category, spent_on, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      tripId,
      input.title,
      input.amountCents,
      input.paidBy,
      input.category,
      input.spentOn,
      nowIso(),
    );
    for (const memberId of input.splitWith) {
      await db.runAsync('INSERT INTO expense_splits (expense_id, member_id) VALUES (?, ?)', id, memberId);
    }
  });
  notifyDataChanged();
}

export async function deleteExpense(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM expenses WHERE id = ?', id);
  notifyDataChanged();
}

export async function addMessage(db: SQLiteDatabase, tripId: string, authorId: string, body: string): Promise<void> {
  await db.runAsync(
    'INSERT INTO messages (id, trip_id, author_id, body, created_at) VALUES (?, ?, ?, ?, ?)',
    createId('msg'),
    tripId,
    authorId,
    body,
    nowIso(),
  );
  notifyDataChanged();
}

export async function addChecklistItem(
  db: SQLiteDatabase,
  tripId: string,
  title: string,
  assigneeId: string | null,
): Promise<void> {
  await db.runAsync(
    'INSERT INTO checklist_items (id, trip_id, title, assignee_id, done, created_at) VALUES (?, ?, ?, ?, 0, ?)',
    createId('chk'),
    tripId,
    title,
    assigneeId,
    nowIso(),
  );
  notifyDataChanged();
}

export async function setChecklistItemDone(db: SQLiteDatabase, id: string, done: boolean): Promise<void> {
  await db.runAsync('UPDATE checklist_items SET done = ? WHERE id = ?', done ? 1 : 0, id);
  notifyDataChanged();
}

export async function assignChecklistItem(db: SQLiteDatabase, id: string, assigneeId: string | null): Promise<void> {
  await db.runAsync('UPDATE checklist_items SET assignee_id = ? WHERE id = ?', assigneeId, id);
  notifyDataChanged();
}

export async function deleteChecklistItem(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM checklist_items WHERE id = ?', id);
  notifyDataChanged();
}
