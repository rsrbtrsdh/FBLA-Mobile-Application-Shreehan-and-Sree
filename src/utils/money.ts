import type { Expense, TripMember } from '@/models/types';

/** 123456 -> "$1,234.56"; whole-dollar amounts drop the cents: 12000 -> "$120". */
export function formatMoney(cents: number, { alwaysShowCents = false } = {}): string {
  const negative = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const dollars = Math.floor(abs / 100);
  const rest = abs % 100;
  const whole = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const text = rest === 0 && !alwaysShowCents ? `$${whole}` : `$${whole}.${String(rest).padStart(2, '0')}`;
  return negative ? `-${text}` : text;
}

/** Splits `amount` cents across `count` people so the parts always add back up exactly. */
export function splitEvenly(amount: number, count: number): number[] {
  const base = Math.floor(amount / count);
  const remainder = amount - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}

export type Balance = { member: TripMember; paidCents: number; owesCents: number; netCents: number };

/** How much each traveler paid, how much of the shared cost is theirs, and the difference. */
export function computeBalances(members: TripMember[], expenses: Expense[]): Balance[] {
  const paid = new Map<string, number>();
  const owes = new Map<string, number>();

  for (const expense of expenses) {
    paid.set(expense.paidBy, (paid.get(expense.paidBy) ?? 0) + expense.amountCents);
    const shares = splitEvenly(expense.amountCents, expense.splitWith.length);
    expense.splitWith.forEach((memberId, i) => {
      owes.set(memberId, (owes.get(memberId) ?? 0) + shares[i]!);
    });
  }

  return members.map((member) => {
    const paidCents = paid.get(member.id) ?? 0;
    const owesCents = owes.get(member.id) ?? 0;
    return { member, paidCents, owesCents, netCents: paidCents - owesCents };
  });
}

export type Settlement = { from: TripMember; to: TripMember; amountCents: number };

/**
 * Fewest-payments settle up: repeatedly matches the person who owes the most
 * with the person who is owed the most.
 */
export function computeSettlements(balances: Balance[]): Settlement[] {
  const debtors = balances
    .filter((b) => b.netCents < 0)
    .map((b) => ({ member: b.member, amount: -b.netCents }))
    .sort((a, b) => b.amount - a.amount);
  const creditors = balances
    .filter((b) => b.netCents > 0)
    .map((b) => ({ member: b.member, amount: b.netCents }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let d = 0;
  let c = 0;
  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d]!;
    const creditor = creditors[c]!;
    const amount = Math.min(debtor.amount, creditor.amount);
    if (amount > 0) settlements.push({ from: debtor.member, to: creditor.member, amountCents: amount });
    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount === 0) d += 1;
    if (creditor.amount === 0) c += 1;
  }
  return settlements;
}
