import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { addMessage } from '@/data/trip-repository';
import type { Member, TripDetail } from '@/models/types';
import { formatTimestamp } from '@/utils/dates';
import { validateMessage } from '@/validation/forms';

const MAX_LENGTH = 500;

export function ChatSection({ detail, me }: { detail: TripDetail; me: Member }) {
  const db = useSQLiteContext();
  const { trip, messages, members } = detail;
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string>();
  const memberById = new Map(members.map((m) => [m.id, m]));

  const send = async () => {
    const result = validateMessage(draft);
    if (!result.ok) {
      setError(result.errors.body);
      return;
    }
    await addMessage(db, trip.id, me.id, result.value.body);
    setDraft('');
    setError(undefined);
  };

  return (
    <View>
      {messages.length === 0 && (
        <EmptyState
          icon="chat"
          title="Start the conversation"
          message="Share updates, vote on ideas and keep every decision in one place."
        />
      )}

      <View style={styles.thread} accessibilityLabel="Group messages">
        {messages.map((message) => {
          const author = memberById.get(message.authorId);
          const mine = message.authorId === me.id;
          return (
            <View key={message.id} style={[styles.messageRow, mine && styles.mineRow]}>
              {!mine && <Avatar name={author?.name ?? '?'} color={author?.color ?? Colors.textSecondary} size={30} />}
              <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                {!mine && <Text style={styles.author}>{author?.name ?? 'Former traveler'}</Text>}
                <Text style={[styles.body, mine && styles.mineText]}>{message.body}</Text>
                <Text style={[styles.time, mine && styles.mineTime]}>{formatTimestamp(message.createdAt)}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={[styles.composer, error ? styles.composerError : null]}>
        <TextInput
          value={draft}
          onChangeText={(t) => {
            setDraft(t);
            setError(undefined);
          }}
          placeholder="Message the group…"
          placeholderTextColor={Colors.textTertiary}
          multiline
          maxLength={MAX_LENGTH + 50}
          accessibilityLabel="Message the group"
          style={styles.input}
        />
        <Pressable
          onPress={send}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          style={({ pressed }) => [styles.send, pressed && styles.pressed]}>
          <Icon name="send" size={18} color={Colors.textOnPrimary} />
        </Pressable>
      </View>
      <View style={styles.meta}>
        {error ? (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : (
          <Text style={Typography.caption}>Messages are saved on this device.</Text>
        )}
        <Text style={[Typography.caption, draft.length > MAX_LENGTH && styles.errorCount]}>
          {draft.length}/{MAX_LENGTH}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thread: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  mineRow: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    gap: 2,
  },
  theirs: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  mine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  author: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  body: {
    fontSize: 15,
    lineHeight: 20,
    color: Colors.text,
  },
  mineText: {
    color: Colors.textOnPrimary,
  },
  time: {
    fontSize: 11,
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
  },
  mineTime: {
    color: 'rgba(255,255,255,0.85)',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    padding: Spacing.sm,
    paddingLeft: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  composerError: {
    borderColor: Colors.danger,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    fontSize: 16,
    paddingVertical: 10,
    color: Colors.text,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  error: {
    fontSize: 13,
    color: Colors.danger,
  },
  errorCount: {
    color: Colors.danger,
  },
});
