import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { ProgressBar } from '@/components/progress-bar';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import {
  addChecklistItem,
  assignChecklistItem,
  deleteChecklistItem,
  setChecklistItemDone,
} from '@/data/trip-repository';
import type { ChecklistItem, TripDetail } from '@/models/types';
import { validateChecklistItem } from '@/validation/forms';

export function ChecklistSection({ detail }: { detail: TripDetail }) {
  const db = useSQLiteContext();
  const { trip, checklist, members } = detail;
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string>();
  const done = checklist.filter((c) => c.done).length;

  const add = async () => {
    const result = validateChecklistItem(draft, checklist);
    if (!result.ok) {
      setError(result.errors.title);
      return;
    }
    await addChecklistItem(db, trip.id, result.value.title, null);
    setDraft('');
    setError(undefined);
  };

  /** Tapping the avatar cycles: unassigned -> each traveler -> unassigned. */
  const cycleAssignee = async (item: ChecklistItem) => {
    const index = members.findIndex((m) => m.id === item.assigneeId);
    const next = index + 1 < members.length ? members[index + 1]!.id : null;
    await assignChecklistItem(db, item.id, next);
  };

  return (
    <View>
      <Card>
        <Text style={Typography.headline}>Shared checklist</Text>
        <Text style={[Typography.callout, styles.subtitle]}>
          Packing, bookings and to-dos. Tap the circle to check items off and the avatar to assign a teammate.
        </Text>
        {checklist.length > 0 && (
          <>
            <ProgressBar
              progress={done / checklist.length}
              height={8}
              color={Colors.success}
              accessibilityLabel={`${done} of ${checklist.length} items done`}
            />
            <Text style={[Typography.caption, styles.count]}>
              {done} of {checklist.length} done
            </Text>
          </>
        )}
      </Card>

      <View style={[styles.addRow, error ? styles.addRowError : null]}>
        <TextInput
          value={draft}
          onChangeText={(t) => {
            setDraft(t);
            setError(undefined);
          }}
          onSubmitEditing={add}
          placeholder="Add an item, e.g. Sunscreen"
          placeholderTextColor={Colors.textTertiary}
          returnKeyType="done"
          maxLength={70}
          accessibilityLabel="New checklist item"
          style={styles.input}
        />
        <Pressable
          onPress={add}
          accessibilityRole="button"
          accessibilityLabel="Add item"
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
          <Icon name="plus" size={18} color={Colors.textOnPrimary} />
        </Pressable>
      </View>
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}

      {checklist.length === 0 ? (
        <EmptyState icon="checklist" title="Nothing on the list" message="Add the first thing your group needs to pack or book." />
      ) : (
        <Card style={styles.list}>
          {checklist.map((item, i) => {
            const assignee = members.find((m) => m.id === item.assigneeId);
            return (
              <View key={item.id} style={[styles.row, i > 0 && styles.divider]}>
                <Pressable
                  onPress={() => setChecklistItemDone(db, item.id, !item.done)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.done }}
                  accessibilityLabel={item.title}
                  hitSlop={8}
                  style={styles.check}>
                  <Icon
                    name={item.done ? 'checkCircle' : 'circle'}
                    size={24}
                    color={item.done ? Colors.success : Colors.textSecondary}
                  />
                </Pressable>
                <Text style={[Typography.body, styles.flex, item.done && styles.doneText]}>{item.title}</Text>
                <Pressable
                  onPress={() => cycleAssignee(item)}
                  accessibilityRole="button"
                  accessibilityLabel={assignee ? `Assigned to ${assignee.name}. Tap to reassign` : 'Unassigned. Tap to assign'}
                  hitSlop={6}>
                  {assignee ? (
                    <Avatar name={assignee.name} color={assignee.color} size={30} />
                  ) : (
                    <View style={styles.unassigned}>
                      <Icon name="personAdd" size={14} color={Colors.textSecondary} />
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => deleteChecklistItem(db, item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.title}`}
                  hitSlop={10}>
                  <Icon name="trash" size={16} color={Colors.textSecondary} />
                </Pressable>
              </View>
            );
          })}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  count: {
    marginTop: Spacing.sm,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    paddingLeft: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
  },
  addRowError: {
    borderColor: Colors.danger,
  },
  input: {
    flex: 1,
    minHeight: 40,
    fontSize: 16,
    color: Colors.text,
  },
  addButton: {
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
  error: {
    fontSize: 13,
    color: Colors.danger,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  list: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 52,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  check: {
    width: 32,
    alignItems: 'center',
  },
  doneText: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  unassigned: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
