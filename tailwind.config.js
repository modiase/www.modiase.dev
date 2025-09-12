/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        bg: 'var(--bg)',
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'Arial', 'Helvetica', 'sans-serif'],
        karla: ['Karla', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
