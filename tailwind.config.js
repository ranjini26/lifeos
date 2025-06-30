/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        pastel: {
          pink: '#f8bbd9',
          purple: '#e0aaff',
          blue: '#c8e7ff',
          green: '#c7f9cc',
          yellow: '#fff3cd',
          orange: '#ffd6a5',
        }
      },
      backdropBlur: {
        '3xl': '64px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};