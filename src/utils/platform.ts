/**
 * Platform Utilities
 * Helper functions for platform-specific behavior and checks
 */

import { Platform } from "react-native";

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  return Platform.OS === "ios";
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  return Platform.OS === "android";
}

/**
 * Check if running on web
 */
export function isWeb(): boolean {
  return Platform.OS === "web";
}

/**
 * Get platform-specific value using Platform.select
 * @param values Object with platform keys (ios, android, web, default)
 */
export function selectPlatform<T>(values: {
  ios?: T;
  android?: T;
  web?: T;
  default?: T;
}): T | undefined {
  return Platform.select(values);
}

/**
 * Get minimum touch target size for current platform
 * iOS: 44x44 points, Android: 48x48 dp
 */
export function getMinTouchTargetSize(): number {
  return Platform.select({
    ios: 44,
    android: 48,
    default: 44,
  });
}

/**
 * Get platform-specific font family
 */
export function getPlatformFont(): string {
  return Platform.select({
    ios: "System", // San Francisco
    android: "Roboto",
    default: "System",
  });
}

/**
 * Check if haptics are available on current platform
 */
export function isHapticsAvailable(): boolean {
  return Platform.OS === "ios" || Platform.OS === "android";
}
