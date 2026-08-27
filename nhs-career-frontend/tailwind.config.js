/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nhs: {
          blue: '#005EB8',
          'dark-blue': '#003087',
          'bright-blue': '#0072CE',
          'light-blue': '#41B6E6',
          'aqua-blue': '#00A9CE',
          black: '#231f20',
          'dark-grey': '#425563',
          'mid-grey': '#768692',
          'pale-grey': '#E8EDEE',
          green: '#009639',
          'light-green': '#78BE20',
          red: '#DA291C',
          'warm-yellow': '#FFB81C',
          yellow: '#FAE100',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)',
        'card-hover': '0 12px 32px -8px rgba(0, 48, 135, 0.18), 0 4px 12px rgba(16, 24, 40, 0.06)',
        'nhs-focus': '0 0 0 4px rgba(0, 94, 184, 0.25)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
