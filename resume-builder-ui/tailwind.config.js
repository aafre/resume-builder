/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0c0c0c',
          light: '#1a1a1a',
        },
        chalk: {
          DEFAULT: '#fafaf8',
          dark: '#f0efe9',
        },
        'stone-warm': '#8a8680',
        mist: '#a8a4a0',
        accent: '#00d47e',
      },
      backgroundClip: {
        text: 'text',
        border: 'border-box',
        padding: 'padding-box',
        content: 'content-box',
      },
      spacing: {
        'header-mobile': 'var(--header-height-mobile)',
        'header-desktop': 'var(--header-height-desktop)',
        'footer': 'var(--footer-height)',
        'mobile-bar': 'var(--mobile-action-bar-height)',
        'tablet-toolbar': 'var(--tablet-toolbar-height)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('touch', '@media (hover: none) and (pointer: coarse)');
    },
    function ({ addUtilities }) {
      addUtilities({
        '.bg-clip-border': {
          '-webkit-background-clip': 'border-box',
          'background-clip': 'border-box',
        },
        '.bg-clip-padding': {
          '-webkit-background-clip': 'padding-box',
          'background-clip': 'padding-box',
        },
        '.bg-clip-content': {
          '-webkit-background-clip': 'content-box',
          'background-clip': 'content-box',
        },
        '.bg-clip-text': {
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
        },
      });
    },
  ],
}