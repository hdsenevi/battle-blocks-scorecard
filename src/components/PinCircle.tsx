/**
 * Pin circle for instructions block formation diagram.
 * Renders a numbered circle (e.g. block pin 1–12).
 */

import { View, Text } from "react-native";

interface PinCircleProps {
  value: string | number;
}

export function PinCircle({ value }: PinCircleProps) {
  return (
    <View className="w-16 h-16 rounded-full border-2 border-stone-400 dark:border-stone-500 items-center justify-center mx-0.5">
      <Text className="text-2xl font-sans-bold text-stone-700 dark:text-stone-300">
        {value}
      </Text>
    </View>
  );
}
