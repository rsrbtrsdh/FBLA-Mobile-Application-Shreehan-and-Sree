import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ChoiceGroup } from '@/components/choice-group';
import { closeScreen, FormScreen } from '@/components/form-screen';
import { TextField } from '@/components/text-field';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { Colors, Spacing } from '@/constants/theme';
import { addExpense } from '@/data/trip-repository';
import { useFormState, useTripFormContext } from '@/hooks/use-trip-form';
import type { ExpenseCategory, Member, TripDetail } from '@/models/types';
import { showNotice } from '@/utils/confirm';
import { toIsoDate } from '@/utils/dates';
import { formatMoney, splitEvenly } from '@/utils/money';
import { parseMoneyToCents } from '@/validation/rules';
import { validateExpense, type ExpenseFormField, type ExpenseFormInput } from '@/validation/forms';

export default function AddExpenseScreen() {
  const { detail, me, ready } = useTripFormContext();
  if (!ready || !detail || !me) return null;
  return <AddExpenseForm detail={detail} me={me} />;
}

function AddExpenseForm({ detail, me }: { detail: TripDetail; me: Member }) {
  const db = useSQLiteContext();
  const { trip, members } = detail;
  const today = toIsoDate(new Date());
  const { values, errors, setErrors, set } = useFormState<ExpenseFormField, ExpenseFormInput>({
    title: '',
    amount: '',
    paidBy: me.id,
    category: 'food',
    spentOn: today > trip.endDate ? trip.endDate : today,
    splitWith: members.map((m) => m.id),
  });
  const [saving, setSaving] = useState(false);

  const memberOptions = members.map((m) => ({ key: m.id, label: m.id === me.id ? 'You' : m.name.split(' ')[0]! }));
  const cents = parseMoneyToCents(values.amount);
  const perPerson =
    cents && values.splitWith.length ? splitEvenly(cents, values.splitWith.length)[0]! : null;

  const toggleSplit = (id: string) =>
    set(
      'splitWith',
      values.splitWith.includes(id) ? values.splitWith.filter((x) => x !== id) : [...values.splitWith, id],
    );

  const submit = async () => {
    const result = validateExpense(values, trip, members);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setSaving(true);
    try {
      await addExpense(db, trip.id, result.value);
      closeScreen();
    } catch (e) {
      setSaving(false);
      showNotice('Couldn’t save expense', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  return (
    <FormScreen
      title="Add an expense"
      subtitle="Shared costs are split evenly between the people you pick."
      submitLabel="Save expense"
      onSubmit={submit}
      submitting={saving}>
      <TextField
        label="Description"
        value={values.title}
        onChangeText={(v) => set('title', v)}
        placeholder="e.g. Ramen dinner"
        maxLength={60}
        error={errors.title}
      />
      <TextField
        label="Amount"
        prefix="$"
        value={values.amount}
        onChangeText={(v) => set('amount', v)}
        placeholder="84.50"
        keyboardType="decimal-pad"
        maxLength={12}
        error={errors.amount}
      />
      <ChoiceGroup<ExpenseCategory>
        label="Category"
        options={EXPENSE_CATEGORIES}
        selected={[values.category]}
        onToggle={(key) => set('category', key)}
      />
      <ChoiceGroup
        label="Paid by"
        options={memberOptions}
        selected={[values.paidBy]}
        onToggle={(key) => set('paidBy', key)}
        error={errors.paidBy}
      />
      <ChoiceGroup
        label="Split with"
        options={memberOptions}
        selected={values.splitWith}
        onToggle={toggleSplit}
        error={errors.splitWith}
        hint="Tap to include or leave someone out."
      />
      {perPerson !== null && !errors.amount && (
        <Text style={styles.preview} accessibilityLiveRegion="polite">
          About {formatMoney(perPerson, { alwaysShowCents: true })} each for {values.splitWith.length}{' '}
          {values.splitWith.length === 1 ? 'person' : 'people'}
        </Text>
      )}
      <TextField
        label="Date"
        value={values.spentOn}
        onChangeText={(v) => set('spentOn', v)}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        error={errors.spentOn}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  preview: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.lg,
  },
});
