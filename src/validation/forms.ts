/**
 * Form validators. Each one returns either a cleaned, typed value ready to save,
 * or a map of field -> error message to show next to the field.
 *
 * Every form runs syntactic checks first (rules.ts), then semantic checks that
 * compare the value with the trip and the data already saved.
 */

import { isPhotoKey, type PhotoKey } from '@/constants/photos';
import type {
  ChecklistItem,
  ExpenseCategory,
  ItineraryCategory,
  ItineraryItem,
  Trip,
  TripMember,
} from '@/models/types';
import { daysBetween, formatShortDate, formatTime, toIsoDate } from '@/utils/dates';

import {
  cleanMultiline,
  cleanText,
  dateError,
  emailError,
  lengthError,
  moneyError,
  nameError,
  parseMoneyToCents,
  placeError,
  timeError,
} from './rules';

export type FieldErrors<F extends string> = Partial<Record<F, string>>;

export type ValidationResult<F extends string, V> =
  | { ok: true; value: V }
  | { ok: false; errors: FieldErrors<F> };

function result<F extends string, V>(errors: FieldErrors<F>, value: () => V): ValidationResult<F, V> {
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, value: value() };
}

const MAX_TRIP_DAYS = 60;
const MAX_YEARS_AHEAD = 3;
const MAX_BUDGET_CENTS = 100_000_000; // $1,000,000

/* ----------------------------------------------------------------- Profile */

export function validateProfile(input: { name: string }) {
  const name = cleanText(input.name);
  const errors: FieldErrors<'name'> = {};
  const error = nameError('Your name', name);
  if (error) errors.name = error;
  return result(errors, () => ({ name }));
}

/* -------------------------------------------------------------------- Trip */

export type TripFormInput = {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: string;
  cover: string;
};

export type TripFormField = keyof TripFormInput;

export function validateTrip(input: TripFormInput, today = new Date()) {
  const destination = cleanText(input.destination);
  const country = cleanText(input.country);
  const startDate = cleanText(input.startDate);
  const endDate = cleanText(input.endDate);
  const errors: FieldErrors<TripFormField> = {};

  const destinationError = placeError('Destination', destination);
  if (destinationError) errors.destination = destinationError;
  const countryError = placeError('Country', country);
  if (countryError) errors.country = countryError;

  const startError = dateError('Start date', startDate);
  const endError = dateError('End date', endDate);
  if (startError) errors.startDate = startError;
  if (endError) errors.endDate = endError;

  // Semantic date checks run once each date is well-formed.
  if (!startError) {
    const todayIso = toIsoDate(today);
    const latest = toIsoDate(new Date(today.getFullYear() + MAX_YEARS_AHEAD, today.getMonth(), today.getDate()));
    if (startDate < todayIso) errors.startDate = 'Start date can’t be in the past.';
    else if (startDate > latest) errors.startDate = `Trips can be planned up to ${MAX_YEARS_AHEAD} years ahead.`;
  }
  if (!startError && !endError) {
    if (endDate < startDate) errors.endDate = 'End date must be on or after the start date.';
    else if (daysBetween(startDate, endDate) > MAX_TRIP_DAYS)
      errors.endDate = `Trips can be at most ${MAX_TRIP_DAYS} days long.`;
  }

  const budgetError = moneyError('Budget', input.budget, { allowZero: true });
  const budgetCents = parseMoneyToCents(input.budget);
  if (budgetError) errors.budget = budgetError;
  else if (budgetCents !== null && budgetCents > MAX_BUDGET_CENTS)
    errors.budget = 'Budget must be $1,000,000 or less.';

  if (!isPhotoKey(input.cover)) errors.cover = 'Pick a cover photo.';

  return result(errors, () => ({
    destination,
    country,
    startDate,
    endDate,
    budgetCents: budgetCents ?? 0,
    cover: input.cover as PhotoKey,
  }));
}

/* --------------------------------------------------------------- Itinerary */

export type ItineraryFormInput = {
  title: string;
  day: string;
  time: string;
  location: string;
  notes: string;
  category: ItineraryCategory;
};

export type ItineraryFormField = keyof ItineraryFormInput;

export function validateItineraryItem(
  input: ItineraryFormInput,
  trip: Trip,
  existing: ItineraryItem[],
) {
  const title = cleanText(input.title);
  const day = cleanText(input.day);
  const time = cleanText(input.time);
  const location = cleanText(input.location);
  const notes = cleanMultiline(input.notes);
  const errors: FieldErrors<ItineraryFormField> = {};

  const titleError = lengthError('Title', title, 2, 60);
  if (titleError) errors.title = titleError;

  const dayError = dateError('Day', day);
  if (dayError) errors.day = dayError;
  else if (day < trip.startDate || day > trip.endDate)
    errors.day = `Pick a day during the trip (${formatShortDate(trip.startDate)} – ${formatShortDate(trip.endDate)}).`;

  const tError = timeError(time);
  if (tError) errors.time = tError;

  if (location.length > 60) errors.location = 'Location must be 60 characters or fewer.';
  if (notes.length > 300) errors.notes = 'Notes must be 300 characters or fewer.';

  // Semantic: two plans can't be booked at the exact same day and time.
  if (!errors.day && !errors.time && time) {
    const clash = existing.find((item) => item.day === day && item.time === time);
    if (clash)
      errors.time = `“${clash.title}” is already planned at ${formatTime(time)} that day.`;
  }

  return result(errors, () => ({
    title,
    day,
    time: time || null,
    location: location || null,
    notes: notes || null,
    category: input.category,
  }));
}

/* ----------------------------------------------------------------- Expense */

export type ExpenseFormInput = {
  title: string;
  amount: string;
  paidBy: string;
  category: ExpenseCategory;
  spentOn: string;
  splitWith: string[];
};

export type ExpenseFormField = keyof ExpenseFormInput;

export function validateExpense(input: ExpenseFormInput, trip: Trip, members: TripMember[]) {
  const title = cleanText(input.title);
  const spentOn = cleanText(input.spentOn);
  const memberIds = new Set(members.map((m) => m.id));
  const errors: FieldErrors<ExpenseFormField> = {};

  const titleError = lengthError('Description', title, 2, 60);
  if (titleError) errors.title = titleError;

  const amountError = moneyError('Amount', input.amount);
  const amountCents = parseMoneyToCents(input.amount);
  if (amountError) errors.amount = amountError;
  else if (amountCents !== null && amountCents > 5_000_000)
    errors.amount = 'A single expense can be at most $50,000.';

  if (!memberIds.has(input.paidBy)) errors.paidBy = 'Choose who paid.';

  const splitWith = [...new Set(input.splitWith)].filter((id) => memberIds.has(id));
  if (splitWith.length === 0) errors.splitWith = 'Split with at least one traveler.';

  const dateErr = dateError('Date', spentOn);
  if (dateErr) errors.spentOn = dateErr;
  else {
    // Deposits are often paid well before a trip, but never after it ends.
    const earliest = toIsoDate(new Date(new Date().getFullYear() - 1, 0, 1));
    if (spentOn > trip.endDate) errors.spentOn = 'The date can’t be after the trip ends.';
    else if (spentOn < earliest) errors.spentOn = 'That date is too far in the past.';
  }

  return result(errors, () => ({
    title,
    amountCents: amountCents ?? 0,
    paidBy: input.paidBy,
    category: input.category,
    spentOn,
    splitWith,
  }));
}

/* ------------------------------------------------------------------ Invite */

export type InviteFormInput = { name: string; email: string };
export type InviteFormField = keyof InviteFormInput;

export function validateInvite(input: InviteFormInput, members: TripMember[]) {
  const name = cleanText(input.name);
  const email = cleanText(input.email).toLowerCase();
  const errors: FieldErrors<InviteFormField> = {};

  const nError = nameError('Name', name);
  if (nError) errors.name = nError;
  const eError = emailError(email, false);
  if (eError) errors.email = eError;

  // Semantic: the same person can't be added to a trip twice.
  if (!errors.name && members.some((m) => m.name.toLowerCase() === name.toLowerCase()))
    errors.name = `${name} is already on this trip.`;
  if (!errors.email && email && members.some((m) => m.email?.toLowerCase() === email))
    errors.email = 'Someone on this trip already uses that email.';
  if (members.length >= 12) errors.name = 'A trip can have up to 12 travelers.';

  return result(errors, () => ({ name, email: email || null }));
}

/* ----------------------------------------------------------------- Message */

export function validateMessage(body: string) {
  const value = cleanMultiline(body);
  const errors: FieldErrors<'body'> = {};
  if (value.length === 0) errors.body = 'Type a message first.';
  else if (value.length > 500) errors.body = 'Messages can be up to 500 characters.';
  return result(errors, () => ({ body: value }));
}

/* --------------------------------------------------------------- Checklist */

export function validateChecklistItem(title: string, existing: ChecklistItem[]) {
  const value = cleanText(title);
  const errors: FieldErrors<'title'> = {};
  const error = lengthError('Item', value, 2, 60);
  if (error) errors.title = error;
  else if (existing.some((item) => item.title.toLowerCase() === value.toLowerCase()))
    errors.title = `“${value}” is already on the list.`;
  return result(errors, () => ({ title: value }));
}
