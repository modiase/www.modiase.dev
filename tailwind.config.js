/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        contrast: 'var(--text-contrast)',
        subtle: 'var(--text-subtle)',
        bg: 'var(--bg)',
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'Arial', 'Helvetica', 'sans-serif'],
        Lato: ['Lato', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
