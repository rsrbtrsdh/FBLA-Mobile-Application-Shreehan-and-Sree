import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { SectionHeader } from '@/components/section-header';
import { ShareButtons } from '@/components/share-buttons';
import { EXPENSE_CATEGORIES, expenseCategory } from '@/constants/categories';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { deleteExpense } from '@/data/trip-repository';
import type { Expense, Member, TripDetail } from '@/models/types';
import { settleUpMessage } from '@/services/social-share';
import { confirmAction } from '@/utils/confirm';
import { formatShortDate } from '@/utils/dates';
import { computeBalances, computeSettlements, formatMoney } from '@/utils/money';

export function BudgetSection({ detail, me }: { detail: TripDetail; me: Member }) {
  const db = useSQLiteContext();
  const { trip, members, expenses } = detail;
  const spent = expenses.reduce((sum, e) => sum + e.amountCents, 0);
  const remaining = trip.budgetCents - spent;
  const balances = computeBalances(members, expenses);
  const settlements = computeSettlements(balances);
  const firstName = (id: string) => (id === me.id ? 'You' : members.find((m) => m.id === id)?.name.split(' ')[0] ?? '?');

  const byCategory = EXPENSE_CATEGORIES.map((c) => ({
    ...c,
    total: expenses.filter((e) => e.category === c.key).reduce((s, e) => s + e.amountCents, 0),
  })).filter((c) => c.total > 0);

  const onDelete = async (expense: Expense) => {
    if (await confirmAction('Delete expense?', `“${expense.title}” (${formatMoney(expense.amountCents)}) will be removed and balances recalculated.`)) {
      await deleteExpense(db, expense.id);
    }
  };

  return (
    <View>
      <Card>
        <Text style={Typography.overline}>Group spending</Text>
        <Text style={styles.total}>{formatMoney(spent, { alwaysShowCents: spent % 100 !== 0 })}</Text>
        {trip.budgetCents > 0 ? (
          <>
            <ProgressBar
              progress={spent / trip.budgetCents}
              height={10}
              accessibilityLabel={`${Math.round((spent / trip.budgetCents) * 100)} percent of budget used`}
            />
            <Text style={[styles.remaining, remaining < 0 && styles.over]}>
              {remaining >= 0
                ? `${formatMoney(remaining)} left of ${formatMoney(trip.budgetCents)} budget`
                : `${formatMoney(-remaining)} over the ${formatMoney(trip.budgetCents)} budget`}
            </Text>
          </>
        ) : (
          <Text style={Typography.callout}>No budget set for this trip.</Text>
        )}

        {byCategory.length > 0 && (
          <View style={styles.categories}>
            {byCategory.map((c) => (
              <View key={c.key} style={styles.categoryRow}>
                <View style={[styles.dot, { backgroundColor: c.color }]} />
                <Text style={[Typography.body, styles.flex]}>{c.label}</Text>
                <Text style={styles.categoryAmount}>{formatMoney(c.total)}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <PrimaryButton
        label="Add an expense"
        icon="plus"
        onPress={() => router.push({ pathname: '/trip/[id]/add-expense', params: { id: trip.id } })}
      />
      <View style={styles.spacer} />

      {expenses.length > 0 && (
        <>
          <SectionHeader title="Settle up" />
          <Card>
            {settlements.length === 0 ? (
              <Text style={Typography.body}>Everyone is even. 🎉</Text>
            ) : (
              settlements.map((s, i) => (
                <View key={i} style={[styles.settleRow, i > 0 && styles.divider]}>
                  <Avatar name={s.from.name} color={s.from.color} size={32} />
                  <Icon name="arrowRight" size={14} color={Colors.textSecondary} />
                  <Avatar name={s.to.name} color={s.to.color} size={32} />
                  <Text style={[Typography.body, styles.flex]}>
                    {firstName(s.from.id)} {s.from.id === me.id ? 'pay' : 'pays'} {firstName(s.to.id)}
                  </Text>
                  <Text style={styles.settleAmount}>{formatMoney(s.amountCents, { alwaysShowCents: true })}</Text>
                </View>
              ))
            )}
            <View style={styles.balances}>
              {balances.map((b) => (
                <Text key={b.member.id} style={Typography.caption}>
                  {firstName(b.member.id)}: paid {formatMoney(b.paidCents)}, share {formatMoney(b.owesCents)}
                </Text>
              ))}
            </View>
          </Card>

          <ShareButtons
            title="Send the settle-up"
            description="Post who owes whom to the group chat so everyone can pay back."
            buildMessage={() => settleUpMessage(trip, members, expenses)}
          />

          <SectionHeader title="Expenses" count={expenses.length} />
          <Card style={styles.list}>
            {expenses.map((expense, i) => {
              const category = expenseCategory(expense.category);
              return (
                <View key={expense.id} style={[styles.expenseRow, i > 0 && styles.divider]}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}1A` }]}>
                    <Icon name={category.icon} size={16} color={category.color} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={Typography.body}>{expense.title}</Text>
                    <Text style={Typography.caption}>
                      {firstName(expense.paidBy)} paid · {formatShortDate(expense.spentOn)} · split {expense.splitWith.length} ways
                    </Text>
                  </View>
                  <Text style={styles.expenseAmount}>{formatMoney(expense.amountCents)}</Text>
                  <Pressable
                    onPress={() => onDelete(expense)}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${expense.title}`}
                    hitSlop={10}>
                    <Icon name="trash" size={16} color={Colors.textSecondary} />
                  </Pressable>
                </View>
              );
            })}
          </Card>
        </>
      )}

      {expenses.length === 0 && (
        <EmptyState
          icon="wallet"
          title="No expenses yet"
          message="Log shared costs like hotels, tickets and dinners. TripSync splits them and tracks who owes whom."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  spacer: {
    height: Spacing.xl,
  },
  total: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: Colors.text,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  remaining: {
    ...Typography.callout,
    marginTop: Spacing.sm,
  },
  over: {
    color: Colors.danger,
  },
  categories: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  settleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  settleAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  balances: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: 4,
  },
  list: {
    paddingVertical: Spacing.xs,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
});
