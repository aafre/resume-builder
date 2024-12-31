/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundClip: {
        text: 'text',
        border: 'border-box',
        padding: 'padding-box',
        content: 'content-box',
      },
    },
  },
  plugins: [
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