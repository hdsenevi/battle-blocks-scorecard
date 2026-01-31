/**
 * Theme Context
 * Stores user's light/dark preference and persists it. Applies override via Appearance.setColorScheme.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "@battle_blocks_theme";

export type ThemeOverride = "light" | "dark" | null;

interface ThemeContextValue {
  themeOverride: ThemeOverride;
  setThemeOverride: (value: ThemeOverride) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeOverride, setThemeOverrideState] = useState<ThemeOverride>(null);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark") {
        setThemeOverrideState(stored);
        Appearance.setColorScheme(stored);
      }
    });
  }, []);

  const setThemeOverride = useCallback((value: ThemeOverride) => {
    setThemeOverrideState(value);
    Appearance.setColorScheme(value);
    if (value === null) {
      AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      AsyncStorage.setItem(THEME_STORAGE_KEY, value);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ themeOverride, setThemeOverride }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeOverride() {
  const context = useContext(ThemeContext);
  return context;
}
