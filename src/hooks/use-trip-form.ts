import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import type { FieldErrors } from '@/validation/forms';

import { useCurrentUser, useTripDetail } from './use-app-data';

/** Loads the trip a form belongs to (from the `id` route param) plus the current user. */
export function useTripFormContext() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useTripDetail(id);
  const me = useCurrentUser();
  return { tripId: id, detail: detail.data ?? null, me: me.data ?? null, ready: detail.status !== 'loading' && me.status !== 'loading' };
}

/** Form state with per-field errors that clear as soon as the user edits that field. */
export function useFormState<F extends string, T extends Record<F, unknown>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<FieldErrors<F>>({});

  const set = <K extends F>(field: K, value: T[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return { values, setValues, errors, setErrors, set };
}
