const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_MS = 24 * 60 * 60 * 1000;

/** Parses "YYYY-MM-DD" as a local date (new Date("YYYY-MM-DD") would use UTC and can shift a day). */
export function parseDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
}

export function nightsBetween(startIso: string, endIso: string): number {
  return Math.round((parseDate(endIso).getTime() - parseDate(startIso).getTime()) / DAY_MS);
}

/** Short countdown label for a trip: "Tomorrow", "In 25 days", "Happening now", "Completed". */
export function tripCountdown(startIso: string, endIso: string, today = new Date()): string {
  const now = startOfDay(today).getTime();
  const daysToStart = Math.round((parseDate(startIso).getTime() - now) / DAY_MS);
  const daysToEnd = Math.round((parseDate(endIso).getTime() - now) / DAY_MS);

  if (daysToEnd < 0) return 'Completed';
  if (daysToStart <= 0) return 'Happening now';
  if (daysToStart === 1) return 'Tomorrow';
  return `In ${daysToStart} days`;
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
