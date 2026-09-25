/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2FA4A9',
        'primary-dark': '#27888C',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}