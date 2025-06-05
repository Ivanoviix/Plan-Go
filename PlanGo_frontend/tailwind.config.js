/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Lato', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}