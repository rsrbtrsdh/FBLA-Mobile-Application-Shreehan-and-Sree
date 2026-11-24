import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { closeScreen, FormScreen } from '@/components/form-screen';
import { ShareButtons } from '@/components/share-buttons';
import { TextField } from '@/components/text-field';
import { Spacing, Typography } from '@/constants/theme';
import { addTraveler } from '@/data/trip-repository';
import { useFormState, useTripFormContext } from '@/hooks/use-trip-form';
import type { Member, TripDetail } from '@/models/types';
import { tripInviteMessage } from '@/services/social-share';
import { showNotice } from '@/utils/confirm';
import { validateInvite, type InviteFormField, type InviteFormInput } from '@/validation/forms';

export default function InviteScreen() {
  const { detail, me, ready } = useTripFormContext();
  if (!ready || !detail || !me) return null;
  return <InviteForm detail={detail} me={me} />;
}

function InviteForm({ detail, me }: { detail: TripDetail; me: Member }) {
  const db = useSQLiteContext();
  const { trip, members } = detail;
  const { values, errors, setErrors, set } = useFormState<InviteFormField, InviteFormInput>({ name: '', email: '' });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const result = validateInvite(values, members);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setSaving(true);
    try {
      await addTraveler(db, trip.id, result.value);
      closeScreen();
    } catch (e) {
      setSaving(false);
      showNotice('Couldn’t add traveler', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  return (
    <FormScreen
      title="Add a traveler"
      subtitle={`Add someone to ${trip.destination} so they can be assigned tasks and split costs.`}
      submitLabel="Add to trip"
      onSubmit={submit}
      submitting={saving}>
      <TextField
        label="Name"
        value={values.name}
        onChangeText={(v) => set('name', v)}
        placeholder="e.g. Alex Kim"
        autoCapitalize="words"
        maxLength={40}
        error={errors.name}
      />
      <TextField
        label="Email (optional)"
        value={values.email}
        onChangeText={(v) => set('email', v)}
        placeholder="alex@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        maxLength={254}
        error={errors.email}
      />
      <Text style={[Typography.callout, styles.or]}>Or send the trip straight to your group chat:</Text>
      <ShareButtons
        title="Share an invite"
        description="Opens WhatsApp, X or Facebook with the trip details filled in."
        buildMessage={() => tripInviteMessage(trip, members, me.id)}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  or: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
});
