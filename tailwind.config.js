/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        dating: {
          match: '#FD5068',
          compatibility: '#FBBF24',
          opportunity: '#FB923C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
