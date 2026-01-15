/**
 * Haptic Feedback Service
 * Wraps Expo Haptics API for consistent haptic feedback across the app
 */

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Check if haptics are available on the current platform
 * @returns true if haptics are available, false otherwise
 */
function isHapticsAvailable(): boolean {
  return Platform.OS === "ios" || Platform.OS === "android";
}

/**
 * Trigger light haptic feedback for normal score entry
 * Completes within 50ms requirement (NFR7)
 */
export async function triggerScoreEntry(): Promise<void> {
  if (!isHapticsAvailable()) {
    return;
  }

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Graceful degradation: log error but don't break app flow
    if (__DEV__) {
      console.warn("Haptic feedback unavailable for score entry:", error);
    }
  }
}

/**
 * Trigger medium/strong haptic feedback for 50+ penalty rule
 * Completes within 50ms requirement (NFR7)
 */
export async function triggerPenalty(): Promise<void> {
  if (!isHapticsAvailable()) {
    return;
  }

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    // Graceful degradation: log error but don't break app flow
    if (__DEV__) {
      console.warn("Haptic feedback unavailable for penalty:", error);
    }
  }
}

/**
 * Trigger success pattern haptic feedback for game completion
 * Completes within 50ms requirement (NFR7)
 */
export async function triggerCompletion(): Promise<void> {
  if (!isHapticsAvailable()) {
    return;
  }

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    // Graceful degradation: log error but don't break app flow
    if (__DEV__) {
      console.warn("Haptic feedback unavailable for completion:", error);
    }
  }
}

/**
 * Trigger error haptic feedback for invalid actions
 * Completes within 50ms requirement (NFR7)
 */
export async function triggerError(): Promise<void> {
  if (!isHapticsAvailable()) {
    return;
  }

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    // Graceful degradation: log error but don't break app flow
    if (__DEV__) {
      console.warn("Haptic feedback unavailable for error:", error);
    }
  }
}
