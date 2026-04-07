/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          dark: '#2d3957',
          panel: '#3c4a62',
          accent: '#38bdf8'
        }
      }
    },
  },
  plugins: [],
}

