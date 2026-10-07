/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161715',
        paper: '#f0eee7',
        rust: '#c95132',
      },
    },
  },
  plugins: [],
}
