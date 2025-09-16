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
        nord0: 'var(--nord0)',
        nord1: 'var(--nord1)',
        nord2: 'var(--nord2)',
        nord3: 'var(--nord3)',
        nord4: 'var(--nord4)',
        nord5: 'var(--nord5)',
        nord6: 'var(--nord6)',
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'Arial', 'Helvetica', 'sans-serif'],
        Lato: ['Lato', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
