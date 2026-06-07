/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gv-dark': '#0f172a',    // Deep Navy (Trust)
        'gv-green': '#064e3b',   // Emerald (Growth)
        'gv-gold': '#927b5c',    // Muted Gold (Wealth)
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // Elegant headings
        sans: ['Inter', 'sans-serif'],          // Precise data
      }
    },
  },
  plugins: [],
}