/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./partials/**/*.html",
  ],
  safelist: [
    'glass-panel',
    'glass',
    'backdrop-blur-md',
    'backdrop-blur-xl',
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
}