/**
 * Settings Screen
 * Third tab with a table-style list of settings options (e.g. Privacy Policy).
 */

import { View, Text, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { SettingsRow } from "@/components/SettingsRow";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeOverride } from "@/contexts/ThemeContext";
import type { ThemeOverride } from "@/contexts/ThemeContext";

function getAppearanceLabel(override: ThemeOverride): string {
  if (override === null) return "Auto";
  return override === "light" ? "Light" : "Dark";
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const themeContext = useThemeOverride();
  const currentOverride = themeContext?.themeOverride ?? null;
  const appearanceLabel = getAppearanceLabel(currentOverride);

  const showAppearanceOptions = () => {
    Alert.alert("Appearance", "Choose appearance", [
      {
        text: "Auto",
        onPress: () => themeContext?.setThemeOverride(null),
      },
      {
        text: "Light",
        onPress: () => themeContext?.setThemeOverride("light"),
      },
      {
        text: "Dark",
        onPress: () => themeContext?.setThemeOverride("dark"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <Text
          className="text-2xl font-sans-bold text-stone-900 dark:text-stone-50 mb-6"
          accessibilityRole="header"
        >
          Settings
        </Text>

        <Text
          className="text-s font-sans-medium text-stone-600 dark:text-stone-50 mb-2"
          accessibilityRole="header"
        >
          Appearance
        </Text>
        <View
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            backgroundColor: colors.backgroundCard,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          accessibilityRole="list"
          accessibilityLabel="Settings list"
        >
          <SettingsRow
            title="Appearance"
            value={appearanceLabel}
            onPress={showAppearanceOptions}
            testID="settings-appearance-row"
            accessibilityLabel={`Appearance, currently ${appearanceLabel}`}
          />
        </View>

        <Text
          className="text-s font-sans-medium text-stone-600 dark:text-stone-50 mb-2"
          accessibilityRole="header"
        >
          General
        </Text>
        <View
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: colors.backgroundCard,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          accessibilityRole="list"
          accessibilityLabel="Settings list"
        >
          <SettingsRow
            title="Game Instructions"
            onPress={() => router.push("/instructions")}
            testID="settings-instructions-row"
            accessibilityLabel="Game Instructions"
          />
          <SettingsRow
            title="Privacy Policy"
            onPress={() => router.push("/privacy")}
            isLast
            testID="settings-privacy-policy-row"
            accessibilityLabel="Privacy Policy"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
