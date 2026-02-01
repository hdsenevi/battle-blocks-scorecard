/**
 * Reusable settings list row: pressable row with title, optional value, and chevron.
 */

import { View, Text, Pressable, Platform } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export type SettingsRowProps = {
  title: string;
  onPress: () => void;
  value?: string;
  isLast?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

export function SettingsRow({
  title,
  onPress,
  value,
  isLast = false,
  testID,
  accessibilityLabel,
}: SettingsRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 ${
        Platform.OS === "ios"
          ? "py-3 min-h-[44px]"
          : "py-3.5 min-h-[48px]"
      }`}
      style={({ pressed }) => [
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        { opacity: pressed ? 0.7 : 1 },
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
    >
      <Text className="text-base font-sans text-stone-900 dark:text-stone-50">
        {title}
      </Text>
      <View className="flex-row items-center gap-2">
        {value != null && (
          <Text className="text-base font-sans text-stone-600 dark:text-stone-400">
            {value}
          </Text>
        )}
        <IconSymbol
          name="chevron.right"
          size={14}
          color={colors.textSecondary}
        />
      </View>
    </Pressable>
  );
}
