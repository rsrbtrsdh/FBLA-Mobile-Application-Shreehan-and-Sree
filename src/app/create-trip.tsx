import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FormScreen } from '@/components/form-screen';
import { PhotoPicker } from '@/components/photo-picker';
import { TextField } from '@/components/text-field';
import { Spacing } from '@/constants/theme';
import { getCurrentUser } from '@/data/settings-repository';
import { createTrip } from '@/data/trip-repository';
import { showNotice } from '@/utils/confirm';
import { validateTrip, type FieldErrors, type TripFormField, type TripFormInput } from '@/validation/forms';

type Params = { destination?: string; country?: string; cover?: string };

export default function CreateTripScreen() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams<Params>();
  const [form, setForm] = useState<TripFormInput>({
    destination: params.destination ?? '',
    country: params.country ?? '',
    startDate: '',
    endDate: '',
    budget: '',
    cover: params.cover ?? 'kyoto',
  });
  const [errors, setErrors] = useState<FieldErrors<TripFormField>>({});
  const [saving, setSaving] = useState(false);

  const update = (field: TripFormField) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = async () => {
    const result = validateTrip(form);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setSaving(true);
    try {
      const me = await getCurrentUser(db);
      if (!me) throw new Error('Set up your profile first.');
      const id = await createTrip(db, result.value, me.id);
      router.replace({ pathname: '/trip/[id]', params: { id } });
    } catch (e) {
      setSaving(false);
      showNotice('Couldn’t save trip', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  return (
    <FormScreen
      title="New trip"
      subtitle="Start with the basics. You can invite friends and add plans next."
      submitLabel="Create Trip"
      onSubmit={submit}
      submitting={saving}>
      <TextField
        label="Destination"
        value={form.destination}
        onChangeText={update('destination')}
        placeholder="e.g. Kyoto"
        autoCapitalize="words"
        maxLength={60}
        error={errors.destination}
      />
      <TextField
        label="Country"
        value={form.country}
        onChangeText={update('country')}
        placeholder="e.g. Japan"
        autoCapitalize="words"
        maxLength={60}
        error={errors.country}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <TextField
            label="Start date"
            value={form.startDate}
            onChangeText={update('startDate')}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            hint="Year-month-day"
            error={errors.startDate}
          />
        </View>
        <View style={styles.flex}>
          <TextField
            label="End date"
            value={form.endDate}
            onChangeText={update('endDate')}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            error={errors.endDate}
          />
        </View>
      </View>
      <TextField
        label="Group budget"
        prefix="$"
        value={form.budget}
        onChangeText={update('budget')}
        placeholder="2500"
        keyboardType="decimal-pad"
        maxLength={12}
        hint="Total for the whole group. Use 0 if you haven’t set one."
        error={errors.budget}
      />
      <PhotoPicker value={form.cover} onChange={update('cover')} error={errors.cover} />
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
