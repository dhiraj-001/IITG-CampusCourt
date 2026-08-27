/**
 * Typography tokens — font families and preset text styles.
 *
 * Font pairing:
 *  - SpaceGrotesk-*  →  display, headings, large numerals (geometric, bold personality)
 *  - Inter-*         →  body copy, labels, captions (maximum legibility at small sizes)
 *
 * Usage in StyleSheet:
 *   fontFamily: FONTS.heading.bold      // SpaceGrotesk_700Bold
 *   fontFamily: FONTS.body.regular      // Inter_400Regular
 */

export const FONTS = {
  heading: {
    regular:     'SpaceGrotesk_400Regular',
    medium:      'SpaceGrotesk_500Medium',
    semiBold:    'SpaceGrotesk_600SemiBold',
    bold:        'SpaceGrotesk_700Bold',
  },
  body: {
    light:       'Inter_300Light',
    regular:     'Inter_400Regular',
    medium:      'Inter_500Medium',
    semiBold:    'Inter_600SemiBold',
    bold:        'Inter_700Bold',
  },
} as const;

/**
 * Pre-built text style objects for common roles.
 * These are partial StyleSheet objects — spread them into your own styles.
 *
 * Example:
 *   title: { ...TYPE.displayLg, color: '#EAEFFF' }
 */
export const TYPE = {
  // Display
  displayLg: { fontFamily: FONTS.heading.bold,    fontSize: 32, letterSpacing: -1.0, lineHeight: 38 },
  displayMd: { fontFamily: FONTS.heading.bold,    fontSize: 26, letterSpacing: -0.6, lineHeight: 32 },
  displaySm: { fontFamily: FONTS.heading.semiBold, fontSize: 22, letterSpacing: -0.4, lineHeight: 28 },

  // Headings
  h1: { fontFamily: FONTS.heading.bold,    fontSize: 20, letterSpacing: -0.3, lineHeight: 26 },
  h2: { fontFamily: FONTS.heading.semiBold, fontSize: 17, letterSpacing: -0.2, lineHeight: 22 },
  h3: { fontFamily: FONTS.heading.medium,  fontSize: 15, letterSpacing: -0.1, lineHeight: 20 },

  // Numerals (stat counters, prices, timers)
  numLg:  { fontFamily: FONTS.heading.bold,    fontSize: 28, letterSpacing: -1.0, lineHeight: 34 },
  numMd:  { fontFamily: FONTS.heading.bold,    fontSize: 22, letterSpacing: -0.5, lineHeight: 28 },
  numSm:  { fontFamily: FONTS.heading.semiBold, fontSize: 16, letterSpacing: -0.3, lineHeight: 20 },

  // Body
  bodyLg: { fontFamily: FONTS.body.regular, fontSize: 15, lineHeight: 22 },
  bodyMd: { fontFamily: FONTS.body.regular, fontSize: 13, lineHeight: 20 },
  bodySm: { fontFamily: FONTS.body.regular, fontSize: 11, lineHeight: 17 },

  // Labels / UI text
  labelLg: { fontFamily: FONTS.body.semiBold, fontSize: 13, letterSpacing: 0.1 },
  labelMd: { fontFamily: FONTS.body.medium,   fontSize: 11, letterSpacing: 0.2 },
  labelSm: { fontFamily: FONTS.body.medium,   fontSize: 9,  letterSpacing: 0.5 },

  // Caption
  caption:    { fontFamily: FONTS.body.regular, fontSize: 11, lineHeight: 16 },
  captionBold: { fontFamily: FONTS.body.semiBold, fontSize: 11, lineHeight: 16 },

  // Button text
  btnLg: { fontFamily: FONTS.body.bold,    fontSize: 15, letterSpacing: 0.1 },
  btnMd: { fontFamily: FONTS.body.semiBold, fontSize: 13, letterSpacing: 0.1 },
  btnSm: { fontFamily: FONTS.body.medium,  fontSize: 11, letterSpacing: 0.2 },
} as const;
