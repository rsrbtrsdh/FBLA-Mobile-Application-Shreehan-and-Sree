/**
 * Domain models shared by the data layer, view-model hooks and UI.
 * Money is always stored as integer cents to avoid floating-point rounding.
 * Dates are ISO calendar dates ("YYYY-MM-DD"); timestamps are ISO date-times.
 */

import type { PhotoKey } from '@/constants/photos';

export type Member = {
  id: string;
  name: string;
  email: string | null;
  color: string;
};

export type TripRole = 'organizer' | 'traveler';

export type TripMember = Member & { role: TripRole };

export type TripStatus = 'planning' | 'in-progress' | 'completed';

export type Trip = {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  budgetCents: number;
  cover: PhotoKey;
  createdBy: string;
  createdAt: string;
};

/** A trip with the aggregates the Home cards need. */
export type TripSummary = Trip & {
  members: TripMember[];
  spentCents: number;
  checklistDone: number;
  checklistTotal: number;
  itineraryCount: number;
};

export type ItineraryCategory = 'activity' | 'food' | 'transport' | 'stay';

export type ItineraryItem = {
  id: string;
  tripId: string;
  title: string;
  day: string;
  time: string | null;
  location: string | null;
  notes: string | null;
  category: ItineraryCategory;
  createdBy: string;
};

export type ExpenseCategory = 'lodging' | 'food' | 'transport' | 'activities' | 'other';

export type Expense = {
  id: string;
  tripId: string;
  title: string;
  amountCents: number;
  paidBy: string;
  category: ExpenseCategory;
  spentOn: string;
  /** Member ids that share this expense equally. */
  splitWith: string[];
};

export type Message = {
  id: string;
  tripId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type ChecklistItem = {
  id: string;
  tripId: string;
  title: string;
  assigneeId: string | null;
  done: boolean;
};

export type TripDetail = {
  trip: Trip;
  members: TripMember[];
  itinerary: ItineraryItem[];
  expenses: Expense[];
  messages: Message[];
  checklist: ChecklistItem[];
};
