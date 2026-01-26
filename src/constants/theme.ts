/**
 * Theme constants inspired by a modern, polished design.
 * Purple-blue primary palette with warm accents. Full light and dark mode support.
 */

import { Platform } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

// Primary: vibrant purple-blue (cool tone from reference)
const tintColorLight = '#7C3AED'; // violet-600
const tintColorDark = '#A78BFA'; // violet-400

export const Colors = {
  light: {
    text: '#1C1917', // stone-900
    textSecondary: '#57534E', // stone-600
    background: '#FAFAF9', // stone-50, soft off-white
    backgroundCard: '#FFFFFF',
    tint: tintColorLight,
    icon: '#57534E',
    tabIconDefault: '#78716C', // stone-500
    tabIconSelected: tintColorLight,
    border: '#E7E5E4', // stone-200
    borderMedium: '#D6D3D1', // stone-300
    surface: '#F5F5F4', // stone-100
  },
  dark: {
    text: '#FAFAF9', // stone-50
    textSecondary: '#A8A29E', // stone-400
    background: '#1C1917', // stone-900
    backgroundCard: '#292524', // stone-800
    tint: tintColorDark,
    icon: '#A8A29E',
    tabIconDefault: '#78716C',
    tabIconSelected: tintColorDark,
    border: '#44403C', // stone-700
    borderMedium: '#57534E', // stone-600
    surface: '#292524', // stone-800
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Poppins',
    sansFallback: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  android: {
    sans: 'Poppins',
    sansFallback: 'Roboto',
    serif: 'serif',
    rounded: 'Roboto',
    mono: 'monospace',
  },
  default: {
    sans: 'Poppins',
    sansFallback: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sansFallback: "system-ui, -apple-system, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'Poppins', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  },
});

export const LightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    text: Colors.light.text,
    card: Colors.light.backgroundCard,
    border: Colors.light.border,
  },
};

export const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    text: Colors.dark.text,
    card: Colors.dark.backgroundCard,
    border: Colors.dark.border,
  },
};
