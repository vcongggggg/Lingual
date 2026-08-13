/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          400: '#ff8a73',
          500: '#ff6b4a',
          600: '#e64e2d',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        slate: {
          950: '#090d16',
          900: '#0f172a',
          800: '#1e293b',
        },
      },
      fontFamily: {
        display: ['Outfit', 'Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        artistic: ['Calistoga', 'serif'],
      },
    },
  },
  plugins: [],
};
