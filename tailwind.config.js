/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blush:    '#FEC0C1',
          soft:     '#FFE2E4',
          red:      '#E20530',
          rose:     '#FEA3A2',
          coral:    '#FF7271',
          cream:    '#FFF8F8',
          dark:     '#1A0A0A',
        }
      },
      // fontFamily: {
      //   display: ['"Courier Prime"', '"Courier New"', 'Courier', 'monospace'],
      //   body:    ['"Courier Prime"', '"Courier New"', 'Courier', 'monospace'],
      // },
      animation: {
        'fade-up':     'fadeUp 0.7s ease forwards',
        'fade-in':     'fadeIn 0.6s ease forwards',
        'shimmer':     'shimmer 2.5s infinite',
        'float':       'float 6s ease-in-out infinite',
        'slide-left':  'slideLeft 0.5s ease forwards',
      },
      keyframes: {
        fadeUp:    { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        slideLeft: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
      },
      backdropBlur: { xs: '2px' },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FEC0C1 0%, #FF7271 50%, #FF002C 100%)',
        'gradient-soft':  'linear-gradient(180deg, #FFF8F8 0%, #FFE2E4 100%)',
      }
    },
  },
  plugins: [],
}
