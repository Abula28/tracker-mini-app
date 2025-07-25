/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ui: {
          // Light mode
          light: {
            background: '#FFFFFF',
            surface: '#F1F5F9',
            muted: '#CBD5E1',
            text: '#1E293B',
            blue: '#3B82F6',
            green: '#10B981',
            amber: '#F59E0B',
            red: '#EF4444',
          },
          // Dark mode
          dark: {
            background: '#0F172A',
            surface: '#1E293B',
            muted: '#334155',
            text: '#F1F5F9',
            blue: '#3B82F6',
            green: '#10B981',
            amber: '#F59E0B',
            red: '#EF4444',
          }
        },
      },
    },
  },
  plugins: [],
}

