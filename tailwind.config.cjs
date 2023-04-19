/** @type {import('tailwindcss').Config} */
<<<<<<< HEAD
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'v': 'var(--font-size)'
      },
      spacing: {
        'v': 'var(--spacing)'
      },
      borderRadius: {
        'v': 'var(--radius)'
      },
      backgroundImage: {
        'dotted': 'radial-gradient(rgb(var(--color-back-alt)) 1px, rgb(var(--color-back)) 0)'
      },
=======
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
>>>>>>> origin/main
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
<<<<<<< HEAD
      transitionTimingFunction: {
        "out-cubic": "cubic-bezier(0.33, 1, 0.68, 1)",
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    },
  },
  plugins: [],
};

module.exports = config;
=======

    },
  },
  plugins: [],
}
>>>>>>> origin/main
