const defaultColors = require("tailwindcss/colors");
const COLORS = {
  primary: {
    1: '#E01A1D',
    2: '#FEF1F0',
  },
  secondary: {
    1: '#E2F1FE',
    2: '#0082e7',
    3: '#093FDA',
  },
  warning: {
    1: '#FEE699'
  },
  'neutral-1': {
    900: '#2C333A',
    800: '#424752',
    700: '#5A6271',
    600: '#6B7280',
    500: '#858F9B',
    400: '#929DAA',
    300: '#A1ACB8',
    200: '#CDD3DB',
    100: '#D2D8E0',
    50: '#DDE2E9',
  },
  'neutral-2': {
    300: '#DAE0E6',
    200: '#E2E7ED',
    100: '#E9EDF2',
    50: '#F2F4F7',
  },
  'neutral-3': {
    300: '#E3E6E9',
    200: '#EBEDEF',
    100: '#F0F1F3',
    50: '#F8F9FB',
  },
  gradient: {},

}

module.exports = {
  content: ["./src/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        ...COLORS
      },
      ringColor: {
        ...COLORS,
      },
      borderColor: {
        ...COLORS,
      },
      placeholderColor: {
        ...COLORS,
      },
      fontSize: {
        'heading-1': ['40px', '53px'],
        'heading-2': ['32px', '43px'],
        'heading-3': ['28px', '37px'],
        'heading-4': ['24px', '32px'],
        'body-1': ['16px', '24px'],
        'body-2': ['14px', '20px'],
        'caption-1': ['13px', '22px'],
        'caption-2': ['12px', '18px'],
        'title-1': ['16px', '24px'],
        'title-2': ['14px', '24px'],
        'header-1': ['20px', '28px'],
        'header-2': ['18px', '28px'],
        'display-1': ['80px', 'auto'],
        'display-2': ['72px', 'auto'],
        'display-3': ['64px', 'auto'],
        'display-4': ['56px', 'auto'],
        'display-5': ['48px', 'auto'],
        'display-6': ['40px', 'auto'],
        'button': ['16px', '24px'],
        'button1': ['14px', '20px'],
      },
      backgroundImage: {},
      animation: {
        'header': 'spin 300ms ease-in-out infinite',
      },
      boxShadow: {
        'shad1': '0 0px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.19)',
      },
      dropShadow: {
        'md': '0 0 0 1px rgba(44, 51, 58, 1)',
      },
      keyframes: {
        'fade-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        'fade-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        'fade-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade': {
          '0%': { opacity: '0', },
          '100%': { opacity: '1', },
        },
      },
      animation: {
        'fade-right': 'fade-right 0.5s ease-out',
        'fade-left': 'fade-left 0.5s ease-out',
        'fade-down': 'fade-down 0.3s ease-out',
        'fade-up': 'fade-up 0.2s ease-out',
        'fade': 'fade 0.5s ease-out',
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
      margin: ["group-hover"],
      visibility: ["group-hover"],
    },
  },
  plugins: [],
};