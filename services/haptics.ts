/**
 * Haptic Feedback Service
 * Provides consistent haptic feedback across the app
 * All haptic triggers complete within 50ms as per NFR7
 */

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Trigger light haptic feedback for normal score entry
 * Uses light impact haptic type
 */
export async function triggerScoreEntry(): Promise<void> {
  try {
    // Light impact for normal user action
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Gracefully handle if haptics unavailable (e.g., simulator, unsupported device)
    // Silently fail to avoid breaking app flow
    if (__DEV__) {
      console.warn("Haptic feedback unavailable for score entry:", error);
    }
  }
}

/**
 * Trigger medium/strong haptic feedback for 50+ penalty rule
 * Uses medium impact haptic type for important rule trigger
 */
export async function triggerPenalty(): Promise<void> {
  try {
    // Medium impact for important rule trigger
    // On iOS, medium provides good feedback; Android will use appropriate vibration
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    // Gracefully handle if haptics unavailable
    if (__DEV__) {
      console.warn("Haptic feedback unavailable for penalty:", error);
    }
  }
}

/**
 * Trigger success pattern haptic feedback for game completion
 * Uses success notification haptic type
 */
export async function triggerCompletion(): Promise<void> {
  try {
    // Success pattern for game win
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  } catch (error) {
    // Gracefully handle if haptics unavailable
    if (__DEV__) {
      console.warn("Haptic feedback unavailable for completion:", error);
    }
  }
}

/**
 * Trigger error haptic feedback for invalid actions
 * Uses error notification haptic type
 */
export async function triggerError(): Promise<void> {
  try {
    // Error haptic for invalid action
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    // Gracefully handle if haptics unavailable
    if (__DEV__) {
      console.warn("Haptic feedback unavailable for error:", error);
    }
  }
}

/**
 * Check if haptics are available on the current platform
 * @returns true if haptics are likely available, false otherwise
 */
export function isHapticsAvailable(): boolean {
  // Haptics are generally available on iOS and modern Android devices
  // This is a best-effort check; actual availability is determined at runtime
  return Platform.OS === "ios" || Platform.OS === "android";
}
