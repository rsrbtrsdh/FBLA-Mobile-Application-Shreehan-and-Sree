/**
 * TripSync design tokens. Every screen and component pulls colors, spacing,
 * radii and type styles from here so the app stays visually consistent.
 */

import { Platform, type TextStyle } from 'react-native';

export const Colors = {
  primary: '#3D5AFE',
  primaryDark: '#2A3FD1',
  primarySoft: '#EEF1FF',
  accent: '#FF6B4A',
  accentSoft: '#FFF0EC',
  success: '#15803D',
  successSoft: '#E8F7EE',
  warning: '#B45309',
  warningSoft: '#FEF3E2',
  danger: '#C62828',
  dangerSoft: '#FDECEC',

  background: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F0F2F7',
  border: '#E7E9F0',

  text: '#0F172A',
  textSecondary: '#56657A', // ≥ 5:1 contrast on background and surface (WCAG AA)
  textTertiary: '#94A3B8',
  textOnPrimary: '#FFFFFF',
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

/** Horizontal padding used by every screen. */
export const ScreenPadding = Spacing.xl;

/** Keeps content readable when the web build is viewed on a wide monitor. */
export const MaxContentWidth = 560;

export const Typography = {
  largeTitle: { fontSize: 30, fontWeight: '700', letterSpacing: -0.6, color: Colors.text },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, color: Colors.text },
  headline: { fontSize: 17, fontWeight: '600', letterSpacing: -0.2, color: Colors.text },
  body: { fontSize: 15, fontWeight: '400', color: Colors.text },
  callout: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  overline: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },
} satisfies Record<string, TextStyle>;

export const Shadows = {
  card: Platform.select({
    web: { boxShadow: '0px 6px 20px rgba(15, 23, 42, 0.08)' },
    default: {
      shadowColor: '#0F172A',
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
  }),
  bar: Platform.select({
    web: { boxShadow: '0px -4px 18px rgba(15, 23, 42, 0.06)' },
    default: {
      shadowColor: '#0F172A',
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: -4 },
      elevation: 12,
    },
  }),
};
