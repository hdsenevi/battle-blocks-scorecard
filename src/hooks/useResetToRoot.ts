import { useCallback } from "react";
import { useNavigation } from "expo-router";

/**
 * Returns a function that resets the navigation stack to (tabs) so there is no way to go back.
 * Use this instead of router.replace("/(tabs)") when you want to clear the entire stack.
 */
export function useResetToRoot() {
  const navigation = useNavigation();

  return useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: "(tabs)" as never }],
    });
  }, [navigation]);
}
