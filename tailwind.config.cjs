/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FDFBF7', 100: '#F8F4EC', 200: '#EFE8D8' },
        charcoal: {
          900: '#181715',
          800: '#22211F',
          700: '#3A3835',
          600: '#524F4A',
          500: '#6B675F',
          400: '#8A857B',
        },
        wood: { DEFAULT: '#8B5A2B', dark: '#6F451E', light: '#A97442' },
        gold: { DEFAULT: '#D4AF37', dark: '#C59B27' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(24, 23, 21, 0.18)',
      },
    },
  },
  plugins: [],
}
