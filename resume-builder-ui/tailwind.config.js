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
          dark: '#f0efe9',
        },
        'stone-warm': '#8a8680',
        mist: '#a8a4a0',
        accent: '#00d47e',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.ink.DEFAULT'),
            '--tw-prose-headings': theme('colors.ink.DEFAULT'),
            '--tw-prose-links': theme('colors.accent'),
            '--tw-prose-bold': theme('colors.ink.DEFAULT'),
            '--tw-prose-bullets': theme('colors.accent'),
            '--tw-prose-quotes': theme('colors.ink.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.accent'),
            '--tw-prose-counters': theme('colors.stone-warm'),
            '--tw-prose-captions': theme('colors.stone-warm'),
            '--tw-prose-code': theme('colors.ink.DEFAULT'),
            '--tw-prose-pre-code': '#e5e7eb',
            '--tw-prose-pre-bg': theme('colors.ink.DEFAULT'),
            fontFamily: theme('fontFamily.display').join(', '),
            a: {
              color: theme('colors.accent'),
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
        'footer': 'var(--footer-height)',
        'mobile-bar': 'var(--mobile-action-bar-height)',
        'tablet-toolbar': 'var(--tablet-toolbar-height)',
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