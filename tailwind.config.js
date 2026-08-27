/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds ──────────────────────────────────────────
        bg: {
          primary:   '#0D0E1A',  // base canvas
          secondary: '#131525',  // slight lift
          card:      '#1E2130',  // standard card surface
          elevated:  '#252840',  // modal / elevated card
        },
        // ── Accent ───────────────────────────────────────────────
        accent: {
          violet:       '#7C3AED',
          'violet-light':'#A78BFA',
          teal:         '#14B8A6',
          'teal-light': '#5EEAD4',
          amber:        '#F59E0B',
          rose:         '#F43F5E',
          green:        '#22C55E',
        },
        // ── Text ─────────────────────────────────────────────────
        text: {
          primary:   '#EAEFFF',  // 15.2:1 on bg  ✅ AAA
          secondary: '#8FA3C0',  //  5.8:1 on bg  ✅ AA
          muted:     '#6B7FA0',  //  3.8:1 on bg  ⚡ AA Large
          disabled:  '#4A5570',
        },
        // ── Borders ──────────────────────────────────────────────
        border:  '#38405E',
        // ── Slot states ──────────────────────────────────────────
        slot: {
          available: '#14B8A6',
          locked:    '#F59E0B',
          booked:    '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
