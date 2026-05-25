/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        oswald: ['Oswald', 'sans-serif'],
      },
      colors: {
        cream: '#FDF8F3',
        cream2: '#F7EDE4',
      },
    },
  },
  plugins: [],
}

