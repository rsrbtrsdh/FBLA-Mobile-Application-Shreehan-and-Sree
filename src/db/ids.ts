/** Collision-resistant id for new rows: time component + random component. */
export function createId(prefix: string): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${time}${random}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Palette used to give each traveler a recognizable avatar color. */
export const MEMBER_COLORS = [
  '#3D5AFE',
  '#FF6B4A',
  '#14B8A6',
  '#F59E0B',
  '#A855F7',
  '#EC4899',
  '#0EA5E9',
  '#22C55E',
];
