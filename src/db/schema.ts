import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Versioned schema migrations. `PRAGMA user_version` records which migrations
 * have run, so upgrading the app never loses a user's saved trips.
 *
 * Integrity rules live in the database itself (NOT NULL, CHECK, FOREIGN KEY,
 * ON DELETE CASCADE) so bad data is rejected even if a UI bug slips through.
 */
const MIGRATIONS: string[] = [
  // v1: initial schema
  `
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS members (
    id    TEXT PRIMARY KEY NOT NULL,
    name  TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 40),
    email TEXT,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS trips (
    id           TEXT PRIMARY KEY NOT NULL,
    destination  TEXT NOT NULL CHECK (length(destination) BETWEEN 2 AND 60),
    country      TEXT NOT NULL CHECK (length(country) BETWEEN 2 AND 60),
    start_date   TEXT NOT NULL,
    end_date     TEXT NOT NULL,
    budget_cents INTEGER NOT NULL CHECK (budget_cents >= 0),
    cover        TEXT NOT NULL,
    created_by   TEXT NOT NULL REFERENCES members(id),
    created_at   TEXT NOT NULL,
    CHECK (end_date >= start_date)
  );

  CREATE TABLE IF NOT EXISTS trip_members (
    trip_id   TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id),
    role      TEXT NOT NULL CHECK (role IN ('organizer', 'traveler')),
    PRIMARY KEY (trip_id, member_id)
  );

  CREATE TABLE IF NOT EXISTS itinerary_items (
    id         TEXT PRIMARY KEY NOT NULL,
    trip_id    TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title      TEXT NOT NULL CHECK (length(title) BETWEEN 2 AND 60),
    day        TEXT NOT NULL,
    time       TEXT,
    location   TEXT,
    notes      TEXT,
    category   TEXT NOT NULL CHECK (category IN ('activity', 'food', 'transport', 'stay')),
    created_by TEXT NOT NULL REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id           TEXT PRIMARY KEY NOT NULL,
    trip_id      TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title        TEXT NOT NULL CHECK (length(title) BETWEEN 2 AND 60),
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    paid_by      TEXT NOT NULL REFERENCES members(id),
    category     TEXT NOT NULL CHECK (category IN ('lodging', 'food', 'transport', 'activities', 'other')),
    spent_on     TEXT NOT NULL,
    created_at   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS expense_splits (
    expense_id TEXT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    member_id  TEXT NOT NULL REFERENCES members(id),
    PRIMARY KEY (expense_id, member_id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         TEXT PRIMARY KEY NOT NULL,
    trip_id    TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    author_id  TEXT NOT NULL REFERENCES members(id),
    body       TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 500),
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS checklist_items (
    id          TEXT PRIMARY KEY NOT NULL,
    trip_id     TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title       TEXT NOT NULL CHECK (length(title) BETWEEN 2 AND 60),
    assignee_id TEXT REFERENCES members(id),
    done        INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
    created_at  TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_itinerary_trip ON itinerary_items(trip_id, day, time);
  CREATE INDEX IF NOT EXISTS idx_expenses_trip ON expenses(trip_id);
  CREATE INDEX IF NOT EXISTS idx_messages_trip ON messages(trip_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_checklist_trip ON checklist_items(trip_id);
  `,
];

export const DATABASE_NAME = 'tripsync.db';

/** Runs once when the database opens (passed to SQLiteProvider's onInit). */
export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  while (version < MIGRATIONS.length) {
    const migration = MIGRATIONS[version]!;
    await db.withTransactionAsync(async () => {
      await db.execAsync(migration);
    });
    version += 1;
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
}
