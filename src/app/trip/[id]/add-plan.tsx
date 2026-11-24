import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChoiceGroup } from '@/components/choice-group';
import { closeScreen, FormScreen } from '@/components/form-screen';
import { TextField } from '@/components/text-field';
import { ITINERARY_CATEGORIES } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { addItineraryItem } from '@/data/trip-repository';
import { useFormState, useTripFormContext } from '@/hooks/use-trip-form';
import type { ItineraryCategory, TripDetail, Member } from '@/models/types';
import { showNotice } from '@/utils/confirm';
import { formatShortDate, toIsoDate } from '@/utils/dates';
import { validateItineraryItem, type ItineraryFormField, type ItineraryFormInput } from '@/validation/forms';

export default function AddPlanScreen() {
  const { detail, me, ready } = useTripFormContext();
  if (!ready || !detail || !me) return null;
  return <AddPlanForm detail={detail} me={me} />;
}

function AddPlanForm({ detail, me }: { detail: TripDetail; me: Member }) {
  const db = useSQLiteContext();
  const { trip } = detail;
  const today = toIsoDate(new Date());
  const defaultDay = today >= trip.startDate && today <= trip.endDate ? today : trip.startDate;
  const { values, errors, setErrors, set } = useFormState<ItineraryFormField, ItineraryFormInput>({
    title: '',
    day: defaultDay,
    time: '',
    location: '',
    notes: '',
    category: 'activity',
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const result = validateItineraryItem(values, trip, detail.itinerary);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setSaving(true);
    try {
      await addItineraryItem(db, trip.id, result.value, me.id);
      closeScreen();
    } catch (e) {
      setSaving(false);
      showNotice('Couldn’t save plan', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  return (
    <FormScreen
      title="Add a plan"
      subtitle={`${trip.destination} · ${formatShortDate(trip.startDate)} – ${formatShortDate(trip.endDate)}`}
      submitLabel="Add to itinerary"
      onSubmit={submit}
      submitting={saving}>
      <TextField
        label="What’s the plan?"
        value={values.title}
        onChangeText={(v) => set('title', v)}
        placeholder="e.g. Sushi dinner in Gion"
        maxLength={60}
        error={errors.title}
      />
      <ChoiceGroup<ItineraryCategory>
        label="Type"
        options={ITINERARY_CATEGORIES}
        selected={[values.category]}
        onToggle={(key) => set('category', key)}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <TextField
            label="Day"
            value={values.day}
            onChangeText={(v) => set('day', v)}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            error={errors.day}
          />
        </View>
        <View style={styles.flex}>
          <TextField
            label="Time (optional)"
            value={values.time}
            onChangeText={(v) => set('time', v)}
            placeholder="18:30"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            hint="24-hour time"
            error={errors.time}
          />
        </View>
      </View>
      <TextField
        label="Location (optional)"
        value={values.location}
        onChangeText={(v) => set('location', v)}
        placeholder="e.g. Pontocho Alley"
        maxLength={60}
        error={errors.location}
      />
      <TextField
        label="Notes (optional)"
        value={values.notes}
        onChangeText={(v) => set('notes', v)}
        placeholder="Reservation number, what to bring…"
        multiline
        maxLength={300}
        error={errors.notes}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flex: {
    flex: 1,
  },
});
