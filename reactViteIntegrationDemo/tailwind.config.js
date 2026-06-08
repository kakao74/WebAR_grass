/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f6fb',
          100: '#e8edf6',
          200: '#cdd8ea',
          300: '#a3b5d4',
          400: '#748db8',
          500: '#526c9a',
          600: '#3f5580',
          700: '#344468',
          800: '#2d3a56',
          900: '#28324a',
          950: '#1a2133',
        },
        coral: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        mint: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        viewer: '0 25px 50px -12px rgba(26, 33, 51, 0.35)',
        card: '0 4px 24px rgba(26, 33, 51, 0.08)',
      },
    },
  },
  plugins: [],
}
