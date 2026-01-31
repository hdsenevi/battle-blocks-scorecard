import { useColorScheme as useRNColorScheme } from "react-native";
import { useThemeOverride } from "@/contexts/ThemeContext";

export function useColorScheme() {
  const themeContext = useThemeOverride();
  const systemScheme = useRNColorScheme();
  return themeContext?.themeOverride ?? systemScheme ?? "light";
}
