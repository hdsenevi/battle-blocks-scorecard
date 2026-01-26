/** @type {import('tailwindcss').Config} */
module.exports = {
  // Story 7.1: Enable dark mode using media query (system preference)
  darkMode: 'media',
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins_400Regular', 'Poppins', 'System', 'sans-serif'],
        'sans-medium': ['Poppins_500Medium', 'Poppins', 'System', 'sans-serif'],
        'sans-semibold': ['Poppins_600SemiBold', 'Poppins', 'System', 'sans-serif'],
        'sans-bold': ['Poppins_700Bold', 'Poppins', 'System', 'sans-serif'],
      },
      colors: {
        // Primary: vibrant purple-blue (cool tones, polished)
        primary: {
          DEFAULT: '#7C3AED',   // violet-600
          light: '#EDE9FE',     // violet-100, highlights & cards
          bright: '#A78BFA',    // violet-400, dark mode primary
          dark: '#6D28D9',     // violet-700
        },
        // Leader: warm amber accent
        leader: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        // Eliminated: neutral stone
        eliminated: {
          DEFAULT: '#78716C',
          light: '#F5F5F4',
        },
        // Active / in-progress: teal
        active: {
          DEFAULT: '#14B8A6',
          light: '#CCFBF1',
        },
        // Semantic grays (light mode; use dark:border-stone-600 etc for dark)
        gray: {
          border: '#E7E5E4',
          'border-medium': '#D6D3D1',
          'bg-light': '#F5F5F4',
        },
        link: {
          DEFAULT: '#7C3AED',
        },
      },
      spacing: {
        "touch-min": "44px",
        "touch-min-android": "48px",
      },
      fontSize: {
        "xs": ["12px", { lineHeight: "16px" }],
        "sm": ["14px", { lineHeight: "20px" }],
        "base": ["16px", { lineHeight: "24px" }],
        "lg": ["18px", { lineHeight: "28px" }],
        "xl": ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["32px", { lineHeight: "40px" }],
        "4xl": ["36px", { lineHeight: "44px" }],
      },
      // Generous rounded corners (reference: "generously rounded")
      borderRadius: {
        "card": "16px",
        "button": "12px",
        "badge": "8px",
        "xl": "16px",
        "2xl": "20px",
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        "elevated": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
      },
      minHeight: {
        "touch-ios": "44px",
        "touch-android": "48px",
      },
      minWidth: {
        "touch-ios": "44px",
        "touch-android": "48px",
      },
    },
  },
  plugins: [],
};
