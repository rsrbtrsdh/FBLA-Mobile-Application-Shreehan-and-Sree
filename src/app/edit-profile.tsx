import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

import { closeScreen, FormScreen } from '@/components/form-screen';
import { TextField } from '@/components/text-field';
import { updateCurrentUserName } from '@/data/settings-repository';
import { useCurrentUser } from '@/hooks/use-app-data';
import { validateProfile } from '@/validation/forms';

export default function EditProfileScreen() {
  const user = useCurrentUser();
  if (!user.data) return null;
  return <EditProfileForm initialName={user.data.name} />;
}

function EditProfileForm({ initialName }: { initialName: string }) {
  const db = useSQLiteContext();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string>();

  const submit = async () => {
    const result = validateProfile({ name });
    if (!result.ok) {
      setError(result.errors.name);
      return;
    }
    await updateCurrentUserName(db, result.value.name);
    closeScreen();
  };

  return (
    <FormScreen title="Edit name" subtitle="This is how your travel crew sees you." submitLabel="Save" onSubmit={submit}>
      <TextField
        label="Your name"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setError(undefined);
        }}
        autoCapitalize="words"
        autoComplete="name"
        maxLength={40}
        error={error}
      />
    </FormScreen>
  );
}
