/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        kids: ['Fredoka', 'Baloo 2', 'Plus Jakarta Sans', 'sans-serif'],
        baloo: ['Baloo 2', 'Fredoka', 'sans-serif'],
        handwriting: ['Kalam', 'cursive'],
        comic: ['Comic Sans MS', 'Chalkboard SE', 'Comic Neue', 'cursive'],
      },
      colors: {
        lavender: {
          50: '#FBF9FE',
          100: '#F6F2FD',
          200: '#EDE5FC',
          300: '#DFD0FA',
          400: '#C7ACF6',
          500: '#A87EF1',
          600: '#8B5CF6',
          700: '#7C3AED',
          800: '#6D28D9',
          900: '#5B21B6',
        },
        brand: {
          purple: '#7C3AED',
          indigo: '#6366F1',
          pink: '#EC4899',
          amber: '#F59E0B',
          emerald: '#10B981',
          bg: '#F8F7FF',
        }
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(124, 58, 237, 0.05)',
        'soft-hover': '0 20px 40px -10px rgba(124, 58, 237, 0.12)',
        'glass': '0 8px 32px 0 rgba(124, 58, 237, 0.08)',
        'clay': 'inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 10px 25px -5px rgba(124, 58, 237, 0.1)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
