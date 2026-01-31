/**
 * Settings Screen
 * Third tab with a table-style list of settings options (e.g. Privacy Policy).
 */

import { View, Text, Pressable, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

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
          <Pressable
            onPress={() => router.push("/privacy")}
            className={`flex-row items-center justify-between px-4 ${
              Platform.OS === "ios" ? "py-3 min-h-[44px]" : "py-3.5 min-h-[48px]"
            }`}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
            testID="settings-privacy-policy-row"
            accessibilityRole="button"
            accessibilityLabel="Privacy Policy"
          >
            <Text
              className="text-base font-sans text-stone-900 dark:text-stone-50"
            >
              Privacy Policy
            </Text>
            <IconSymbol
              name="chevron.right"
              size={14}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
