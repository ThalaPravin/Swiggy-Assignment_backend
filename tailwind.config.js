/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        noir: {
          bg: '#0b0b0c',
          panel: '#131315',
          panelInner: '#0e0e10',
          line: '#26262a',
          lineBright: '#38383e',
          ink: '#ecebe6',
          dim: '#8d8c86',
          lamp: '#f2b544',       // Warm vintage tungsten amber
          lampMuted: '#966d24',
          blood: '#e5533d',      // Investigation alert red
          bloodMuted: '#6e271c',
          ok: '#7fc79a',         // Sage green for verified
          okMuted: '#2e553c',
          dossier: '#ece6d6',    // Aged Manila paper
          dossierInk: '#1b1a17'  // Typewriter black
        },
        swiggy: {
          orange: '#FC8019',
          orangeDark: '#E26D0B',
          orangeLight: '#FFF2E6'
        }
      },
      boxShadow: {
        'spotlight': '0 0 120px rgba(242, 181, 68, 0.18)',
        'dossier': '0 30px 80px rgba(0, 0, 0, 0.65)',
        'lampGlow': '0 0 25px rgba(242, 181, 68, 0.25)',
        'bloodGlow': '0 0 15px rgba(229, 83, 61, 0.35)',
        'okGlow': '0 0 15px rgba(127, 199, 154, 0.35)',
      }
    },
  },
  plugins: [],
}
