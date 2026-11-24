/**
 * Low-level, reusable validation rules.
 *
 * Syntactic rules check the *shape* of a value (format, length, characters).
 * Semantic rules (in forms.ts) check whether the value *makes sense* given the
 * rest of the data: e.g. an end date after the start date, or an activity that
 * falls inside the trip.
 */

/** Removes control characters, collapses repeated whitespace and trims. */
export function cleanText(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Same as cleanText but keeps line breaks (used for chat messages and notes). */
export function cleanMultiline(value: string): string {
  return value
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function lengthError(label: string, value: string, min: number, max: number): string | null {
  if (value.length === 0) return `${label} is required.`;
  if (value.length < min) return `${label} must be at least ${min} characters.`;
  if (value.length > max) return `${label} must be ${max} characters or fewer.`;
  return null;
}

/** Letters (including accented), spaces, apostrophes, periods and hyphens. */
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ' .-]*$/;

export function nameError(label: string, value: string, max = 40): string | null {
  return (
    lengthError(label, value, 2, max) ??
    (NAME_PATTERN.test(value) ? null : `${label} can only use letters, spaces, hyphens and apostrophes.`)
  );
}

/** Place names may also contain digits, commas and parentheses (e.g. "Kyoto (Gion)"). */
const PLACE_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9][A-Za-zÀ-ÖØ-öø-ÿ0-9' .,()&-]*$/;

export function placeError(label: string, value: string, max = 60): string | null {
  return (
    lengthError(label, value, 2, max) ??
    (PLACE_PATTERN.test(value) ? null : `${label} contains characters that aren't allowed.`)
  );
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** True for a real calendar date in YYYY-MM-DD form (rejects 2026-02-30). */
export function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number) as [number, number, number];
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function dateError(label: string, value: string): string | null {
  if (value.length === 0) return `${label} is required.`;
  if (!ISO_DATE_PATTERN.test(value)) return `${label} must look like YYYY-MM-DD.`;
  if (!isIsoDate(value)) return `${label} isn't a real calendar date.`;
  return null;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Accepts 24-hour "HH:MM". Empty is allowed because time is optional. */
export function timeError(value: string): string | null {
  if (value.length === 0) return null;
  return TIME_PATTERN.test(value) ? null : 'Time must be 24-hour HH:MM, like 09:30 or 18:45.';
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export function emailError(value: string, required: boolean): string | null {
  if (value.length === 0) return required ? 'Email is required.' : null;
  if (value.length > 254) return 'Email is too long.';
  return EMAIL_PATTERN.test(value) ? null : 'Enter a valid email, like name@example.com.';
}

const MONEY_PATTERN = /^\d{1,7}(\.\d{1,2})?$/;

/**
 * Parses a money string ("1,250.50", "$80") into integer cents.
 * Returns null when the format is invalid.
 */
export function parseMoneyToCents(value: string): number | null {
  const normalized = value.replace(/[$,\s]/g, '');
  if (!MONEY_PATTERN.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.') as [string, string?];
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

export function moneyError(label: string, value: string, { allowZero = false } = {}): string | null {
  if (value.trim().length === 0) return `${label} is required.`;
  const cents = parseMoneyToCents(value);
  if (cents === null) return `${label} must be a number with up to 2 decimals, like 120 or 45.50.`;
  if (!allowZero && cents === 0) return `${label} must be more than $0.`;
  return null;
}
