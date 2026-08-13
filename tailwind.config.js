/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D1C6',
        'primary-dark': '#00B3A6',
        secondary: '#E0F7FA',
        'brand-navy': '#0D0F35',
        alert: '#DC2626',
        success: '#16A34A',
      }
    },
  },
  plugins: [],
}