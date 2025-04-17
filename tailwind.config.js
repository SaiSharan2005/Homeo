/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    
  ],

  theme: {
    extend: {
      colors: {
        primary: '#2ecc71',     // Vibrant Emerald Green for healing and renewal
        secondary: '#27ae60',   // Deep Forest Green for stability and trust
        background: '#F8F9FA',  // Off-White for a clean, modern interface
        neutral: '#7f8c8d',     // Warm Gray for text and secondary elements
        accent: '#e67e22',      // Burnt Orange for subtle, energizing highlights
      },
    },
    fontFamily: {
      'custom': ['Inter', 'sans-serif'],
    },
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
