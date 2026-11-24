import type { TripStatus } from '@/models/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_MS = 24 * 60 * 60 * 1000;

/** Parses "YYYY-MM-DD" as a local date (new Date("YYYY-MM-DD") would use UTC and can shift a day). */
export function parseDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number) as [number, number, number];
  return new Date(year, month - 1, day);
}

/** Local calendar date as "YYYY-MM-DD". */
export function toIsoDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = parseDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** Whole days from `startIso` to `endIso` (DST-safe because both are local midnights). */
export function daysBetween(startIso: string, endIso: string): number {
  return Math.round((parseDate(endIso).getTime() - parseDate(startIso).getTime()) / DAY_MS);
}

export function nightsBetween(startIso: string, endIso: string): number {
  return daysBetween(startIso, endIso);
}

/** Every date of the trip, inclusive. */
export function tripDays(startIso: string, endIso: string): string[] {
  const days: string[] = [];
  for (let i = 0; i <= daysBetween(startIso, endIso); i += 1) days.push(addDays(startIso, i));
  return days;
}

/** "Dec 18 – 27, 2026", "Mar 29 – Apr 3, 2027" or "Dec 28, 2026 – Jan 4, 2027". */
export function formatDateRange(startIso: string, endIso: string): string {
  const start = parseDate(startIso);
  const end = parseDate(endIso);
  const startMonth = MONTHS[start.getMonth()];
  const endMonth = MONTHS[end.getMonth()];

  if (start.getFullYear() !== end.getFullYear()) {
    return `${startMonth} ${start.getDate()}, ${start.getFullYear()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
  }
  if (startIso === endIso) return `${startMonth} ${start.getDate()}, ${start.getFullYear()}`;
  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
}

/** "Dec 18" */
export function formatShortDate(iso: string): string {
  const date = parseDate(iso);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** "Friday, Dec 18" */
export function formatDayHeading(iso: string): string {
  const date = parseDate(iso);
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** "18:45" -> "6:45 PM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number) as [number, number];
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** "2:05 PM" today, otherwise "Dec 18, 2:05 PM". */
export function formatTimestamp(isoDateTime: string, now = new Date()): string {
  const date = new Date(isoDateTime);
  const time = formatTime(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`);
  if (toIsoDate(date) === toIsoDate(now)) return time;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${time}`;
}

export function tripStatus(startIso: string, endIso: string, today = new Date()): TripStatus {
  const todayIso = toIsoDate(today);
  if (todayIso > endIso) return 'completed';
  if (todayIso >= startIso) return 'in-progress';
  return 'planning';
}

/** Short countdown label for a trip: "Tomorrow", "In 25 days", "Day 2 of 9", "Completed". */
export function tripCountdown(startIso: string, endIso: string, today = new Date()): string {
  const todayIso = toIsoDate(today);
  const status = tripStatus(startIso, endIso, today);
  if (status === 'completed') return 'Completed';
  if (status === 'in-progress') {
    return `Day ${daysBetween(startIso, todayIso) + 1} of ${daysBetween(startIso, endIso) + 1}`;
  }
  const days = daysBetween(todayIso, startIso);
  return days === 1 ? 'Tomorrow' : `In ${days} days`;
}

/** "Monday, Nov 23" */
export function formatToday(today = new Date()): string {
  return `${WEEKDAYS[today.getDay()]}, ${MONTHS[today.getMonth()]} ${today.getDate()}`;
}

export function greetingFor(today = new Date()): string {
  const hour = today.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
