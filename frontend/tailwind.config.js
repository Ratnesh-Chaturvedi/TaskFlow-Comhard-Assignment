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
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6366f1',
          800: '#4f46e5',
          900: '#3730a3',
        },
        surface: {
          light: '#f7f8fd',
          card: '#ffffff',
          subtle: '#f1f5f9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 25px -4px rgba(139, 92, 246, 0.08), 0 2px 10px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 2px 16px -2px rgba(148, 163, 184, 0.12)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
