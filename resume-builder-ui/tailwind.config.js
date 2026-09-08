/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Bricolage Grotesque"', '"Bricolage Fallback"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Bricolage Fallback"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0c0c0c',
          light: '#1a1a1a',
        },
        chalk: {
          DEFAULT: '#fafaf8',
          dark: '#f6f6f5',
        },
        accent: '#00d47e',
        'accent-text': '#007a48',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.ink.DEFAULT'),
            '--tw-prose-headings': theme('colors.ink.DEFAULT'),
            '--tw-prose-links': theme('colors.accent-text'),
            '--tw-prose-bold': theme('colors.ink.DEFAULT'),
            '--tw-prose-bullets': theme('colors.accent'),
            '--tw-prose-quotes': theme('colors.ink.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.accent'),
            // Muted/secondary text is ink at 60% opacity, not a separate token — see
            // "no bespoke grey" note on the color palette below. rgba() here because
            // theme() returns a flat hex, not an opacity-aware value.
            '--tw-prose-counters': 'rgba(12, 12, 12, 0.6)',
            '--tw-prose-captions': 'rgba(12, 12, 12, 0.6)',
            '--tw-prose-code': theme('colors.ink.DEFAULT'),
            '--tw-prose-pre-code': '#e5e7eb',
            '--tw-prose-pre-bg': theme('colors.ink.DEFAULT'),
            fontFamily: theme('fontFamily.display').join(', '),
            a: {
              color: theme('colors.accent-text'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.ink.DEFAULT'),
                textDecoration: 'underline',
              },
            },
            code: {
              fontFamily: theme('fontFamily.mono').join(', '),
              backgroundColor: theme('colors.chalk.dark'),
              borderRadius: '0.25rem',
              padding: '0.15em 0.35em',
              fontWeight: '500',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      }),
      backgroundClip: {
        text: 'text',
        border: 'border-box',
        padding: 'padding-box',
        content: 'content-box',
      },
      spacing: {
        'header-mobile': 'var(--header-height-mobile)',
        'header-desktop': 'var(--header-height-desktop)',
        'mobile-bar': 'var(--mobile-action-bar-height)',
        // Workbench density scale — editor surfaces only. See styles.css.
        'edit-field': 'var(--edit-gap-field)',
        'edit-group': 'var(--edit-gap-group)',
        'edit-block': 'var(--edit-gap-block)',
        'edit-section': 'var(--edit-gap-section)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
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