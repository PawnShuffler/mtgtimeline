/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'mtg-black-bg': '#150B00',
      'mtg-black-card': '#211E1E',
      'mtg-white': '#FFFBD5',
      'mtg-blue': '#0E68AB',
      'mtg-red': '#D3202A',
      'mtg-green': '#00733E'
    },
    extend: {
    },
  },
  plugins: [],
}
