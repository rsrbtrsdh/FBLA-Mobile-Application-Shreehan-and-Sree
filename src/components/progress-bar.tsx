import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';

type ProgressBarProps = {
  /** 0..1; values above 1 are drawn full and in the warning color (e.g. over budget). */
  progress: number;
  width?: number | `${number}%`;
  height?: number;
  color?: string;
  accessibilityLabel: string;
};

export function ProgressBar({
  progress,
  width = '100%',
  height = 6,
  color = Colors.primary,
  accessibilityLabel,
}: ProgressBarProps) {
  const over = progress > 1;
  const clamped = Math.max(0, Math.min(progress, 1));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { width, height, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: over ? Colors.danger : color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.surfaceMuted,
    overflow: 'hidden',
  },
});
