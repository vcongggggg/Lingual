import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAF5EA',
          2: '#F1E9D6',
        },
        card: '#FFFDF6',
        ink: {
          DEFAULT: '#211A13',
          soft: '#6B5F4E',
          muted: '#8F8270',
        },
        red: {
          DEFAULT: '#D64027',
          dark: '#A82E1C',
        },
        teal: {
          DEFAULT: '#0F766E',
          dark: '#0D655E',
        },
        amber: {
          DEFAULT: '#F2A93B',
          soft: '#FDF3E3',
        },
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0 #211A13',
        'brutal': '4px 4px 0 #211A13',
        'brutal-lg': '6px 6px 0 #211A13',
        'brutal-xl': '8px 8px 0 #211A13',
        'brutal-2xl': '10px 10px 0 #211A13',
      },
    },
  },
  plugins: [],
};

export default config;
