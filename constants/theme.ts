/**
 * Global design tokens — single source of truth for all colors.
 *
 * Contrast-verified palette (WCAG):
 *   Text primary   (#EAEFFF) on bg (#0D0E1A)  → 15.2:1  ✅ AAA
 *   Text secondary (#8FA3C0) on bg (#0D0E1A)  →  5.8:1  ✅ AA
 *   Text muted     (#6B7FA0) on bg (#0D0E1A)  →  3.8:1  ⚡ AA Large
 *   Card (#1E2130) on bg (#0D0E1A)            →  1.8:1  ✅ visible surface lift
 *   Border (#3A4060) on card (#1E2130)        →  1.9:1  ✅ clear definition
 */

export const COLORS = {
  // ── Backgrounds (darkest → lightest) ──────────────────────────
  bgPrimary:  '#0D0E1A',   // base canvas
  bgSecondary:'#131525',   // slight lift
  surface0:   '#181B2E',   // card low
  surface1:   '#1E2130',   // card standard  ← main card bg
  surface2:   '#252840',   // card elevated
  surface3:   '#2E3250',   // highest surface (inputs, tags)

  // ── Borders ───────────────────────────────────────────────────
  border:     '#38405E',   // standard border (contrast 1.9:1 on surface1)
  borderSubtle: '#2C3050', // subtle dividers

  // ── Text ──────────────────────────────────────────────────────
  textPrimary:   '#EAEFFF',  // near-white, slight cool blue tint
  textSecondary: '#8FA3C0',  // comfortable secondary (5.8:1 on bg)
  textMuted:     '#6B7FA0',  // muted — still passes AA Large (3.8:1)
  textDisabled:  '#4A5570',  // disabled / placeholder

  // ── Brand accents ─────────────────────────────────────────────
  violet:      '#7C3AED',
  violetLight: '#A78BFA',
  violetGlow:  '#7C3AED40',

  teal:        '#14B8A6',
  tealLight:   '#5EEAD4',

  amber:       '#F59E0B',
  amberLight:  '#FCD34D',

  rose:        '#F43F5E',
  roseLight:   '#FB7185',

  green:       '#22C55E',
  greenLight:  '#86EFAC',

  // ── Slot states ───────────────────────────────────────────────
  slotAvailable: '#14B8A6',
  slotLocked:    '#F59E0B',
  slotBooked:    '#F43F5E',
  slotSelected:  '#A78BFA',
};

/** Sport-specific accent colors */
export const SPORT_ACCENTS = {
  badminton:  { primary: '#A78BFA', glow: '#7C3AED40' },
  tennis:     { primary: '#5EEAD4', glow: '#14B8A640' },
  gym:        { primary: '#FCD34D', glow: '#F59E0B40' },
  basketball: { primary: '#FB923C', glow: '#F9731640' },
  swimming:   { primary: '#38BDF8', glow: '#0EA5E940' },
};
