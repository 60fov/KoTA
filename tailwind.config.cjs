/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary: 'rgb(var(--color-primary) / <alpha-value>)',
        // secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        // "background-primary": 'rgb(var(--color-bg-primary) / <alpha-value>)',
        // "background-secondary": 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        access: 'rgb(var(--color-access) / <alpha-value>)',
        keyboard: 'rgb(var(--color-keyboard) / <alpha-value>)',
        "keyboard-shadow": 'rgb(var(--color-keyboard-shadow) / <alpha-value>)',
        front: 'rgb(var(--color-front) / <alpha-value>)',
        "front-alt": 'rgb(var(--color-front-alt) / <alpha-value>)',
        back: 'rgb(var(--color-back) / <alpha-value>)',
        "back-alt": 'rgb(var(--color-back-alt) / <alpha-value>)',
      },

    },
  },
  plugins: [],
}
