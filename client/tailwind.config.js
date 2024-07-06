/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      maxWidth: {
        custom: '60%',
      }
    },
  },
  plugins: [],
}