import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

type AvatarProps = {
  name: string;
  color: string;
  size?: number;
  /** Adds a white ring, used when avatars overlap in a stack. */
  bordered?: boolean;
};

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

export function Avatar({ name, color, size = 40, bordered = false }: AvatarProps) {
  return (
    <View
      accessibilityLabel={name}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        bordered && styles.bordered,
      ]}>
      <Text
        numberOfLines={1}
        style={[styles.initials, { fontSize: size * (bordered ? 0.32 : 0.38) }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

type AvatarStackProps = {
  people: { id: string; name: string; color: string }[];
  size?: number;
  max?: number;
};

export function AvatarStack({ people, size = 30, max = 3 }: AvatarStackProps) {
  const visible = people.slice(0, max);
  const hidden = people.length - visible.length;
  const overlap = -size * 0.22;

  return (
    <View style={styles.stack}>
      {visible.map((person, index) => (
        <View key={person.id} style={index > 0 && { marginLeft: overlap }}>
          <Avatar name={person.name} color={person.color} size={size} bordered />
        </View>
      ))}
      {hidden > 0 && (
        <View
          style={[
            styles.avatar,
            styles.bordered,
            styles.more,
            { width: size, height: size, borderRadius: size / 2, marginLeft: overlap },
          ]}>
          <Text style={[styles.moreText, { fontSize: size * 0.36 }]}>+{hidden}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: {
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  initials: {
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },
  stack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  more: {
    backgroundColor: Colors.surfaceMuted,
  },
  moreText: {
    color: Colors.textSecondary,
    fontWeight: '700',
  },
});
