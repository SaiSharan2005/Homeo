/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      'custom': ['Inter', 'san-serif'], // Replace 'YourCustomFont' with the name of your custom font
    },
    extend: {},
  },
  plugins: [],
  screens: { 
    'xs': '330px',
    'sm': '640px', 
    'md': '1024px', 
    'lg': '1280px', 
    'xl': '1600px', 
    '2xl': '1920px',
    '3xl': '2140px',
    'landscape': {'raw': '(orientation: landscape)'}
  }, 
}

