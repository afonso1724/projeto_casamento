/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'luxury-bg': '#FAF9F6',
        'luxury-gold': '#D4AF37',
        'luxury-dark': '#1C1C1C',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4D47F 100%)',
        'luxury-gradient-reverse': 'linear-gradient(135deg, #F4D47F 0%, #D4AF37 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 40px rgba(212, 175, 55, 0.15)',
        'luxury-md': '0 10px 25px rgba(212, 175, 55, 0.1)',
        'luxury-lg': '0 25px 50px rgba(212, 175, 55, 0.2)',
      },
      borderRadius: {
        'luxury': '12px',
      },
    },
  },
  plugins: [],
};
