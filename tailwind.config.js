/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Custom colors for game state indicators
      colors: {
        // Leader indicator
        leader: {
          DEFAULT: "#007AFF",
          light: "#F0F8FF",
        },
        // Eliminated player indicator
        eliminated: {
          DEFAULT: "#999999",
          light: "#F5F5F5",
        },
        // Active player indicator
        active: {
          DEFAULT: "#34C759",
          light: "#F0FDF4",
        },
        // Primary brand color
        primary: {
          DEFAULT: "#007AFF",
          dark: "#0051D5",
          light: "#F0F8FF",
        },
      },
      // Spacing system optimized for mobile touch interactions
      // Minimum touch targets: 44x44 points iOS, 48x48 dp Android
      spacing: {
        "touch-min": "44px", // iOS minimum
        "touch-min-android": "48px", // Android minimum
      },
      // Typography scale - large, readable font sizes suitable for ages 6+
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
      // Border radius for friendly, approachable feel
      borderRadius: {
        "card": "12px",
        "button": "8px",
        "badge": "4px",
      },
      // Shadows for subtle elevation and visual hierarchy
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "elevated": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      // Minimum heights for touch targets
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
