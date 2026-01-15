/**
 * Accessibility Utilities
 * Helper functions for accessibility features
 */

import { Platform } from "react-native";

/**
 * Get minimum touch target size based on platform
 */
export function getMinTouchTargetSize(): number {
  return Platform.select({
    ios: 44,
    android: 48,
    default: 44,
  });
}

/**
 * Check if reduced motion is preferred
 * Note: This is a placeholder - actual implementation would use
 * AccessibilityInfo or similar API
 */
export function prefersReducedMotion(): boolean {
  // In a real implementation, this would check system preferences
  // For now, return false (no reduced motion)
  return false;
}

/**
 * Get accessible label for score entry
 */
export function getScoreEntryLabel(
  playerName: string,
  currentScore: number,
  isLeader: boolean,
  isEliminated: boolean
): string {
  let label = `${playerName}, Score: ${currentScore}`;
  if (isLeader) {
    label += ", Leader";
  }
  if (isEliminated) {
    label += ", Eliminated";
  }
  return label;
}

/**
 * Get accessible hint for score entry button
 */
export function getScoreEntryHint(
  isEliminated: boolean,
  gameCompleted: boolean
): string {
  if (gameCompleted) {
    return "Game is completed. No score entries allowed.";
  }
  if (isEliminated) {
    return "Player is eliminated. No score entries allowed.";
  }
  return "Double tap to enter score for this player.";
}
