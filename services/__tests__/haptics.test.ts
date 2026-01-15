/**
 * Haptics Service Tests
 * Tests for haptic feedback service functions
 */

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import {
  triggerScoreEntry,
  triggerPenalty,
  triggerCompletion,
  triggerError,
  isHapticsAvailable,
} from "../haptics";

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
    Rigid: "rigid",
    Soft: "soft",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

// Mock Platform
jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

describe("Haptics Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("triggerScoreEntry", () => {
    it("should trigger light impact haptic", async () => {
      await triggerScoreEntry();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Haptics unavailable");
      (Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(error);

      // Should not throw
      await expect(triggerScoreEntry()).resolves.toBeUndefined();

      // Should have attempted to trigger haptic
      expect(Haptics.impactAsync).toHaveBeenCalled();
    });

    it("should complete quickly (performance test)", async () => {
      const startTime = Date.now();
      await triggerScoreEntry();
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within 50ms (allowing some buffer for test environment)
      expect(duration).toBeLessThan(100);
    });
  });

  describe("triggerPenalty", () => {
    it("should trigger medium impact haptic", async () => {
      await triggerPenalty();

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Haptics unavailable");
      (Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(error);

      await expect(triggerPenalty()).resolves.toBeUndefined();
      expect(Haptics.impactAsync).toHaveBeenCalled();
    });

    it("should complete quickly (performance test)", async () => {
      const startTime = Date.now();
      await triggerPenalty();
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe("triggerCompletion", () => {
    it("should trigger success notification haptic", async () => {
      await triggerCompletion();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      );
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Haptics unavailable");
      (Haptics.notificationAsync as jest.Mock).mockRejectedValueOnce(error);

      await expect(triggerCompletion()).resolves.toBeUndefined();
      expect(Haptics.notificationAsync).toHaveBeenCalled();
    });

    it("should complete quickly (performance test)", async () => {
      const startTime = Date.now();
      await triggerCompletion();
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe("triggerError", () => {
    it("should trigger error notification haptic", async () => {
      await triggerError();

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Error
      );
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Haptics unavailable");
      (Haptics.notificationAsync as jest.Mock).mockRejectedValueOnce(error);

      await expect(triggerError()).resolves.toBeUndefined();
      expect(Haptics.notificationAsync).toHaveBeenCalled();
    });

    it("should complete quickly (performance test)", async () => {
      const startTime = Date.now();
      await triggerError();
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe("isHapticsAvailable", () => {
    it("should return true for iOS", () => {
      (Platform as any).OS = "ios";
      expect(isHapticsAvailable()).toBe(true);
    });

    it("should return true for Android", () => {
      (Platform as any).OS = "android";
      expect(isHapticsAvailable()).toBe(true);
    });

    it("should return false for web", () => {
      (Platform as any).OS = "web";
      expect(isHapticsAvailable()).toBe(false);
    });
  });

  describe("Platform-specific behavior", () => {
    it("should work on iOS", async () => {
      (Platform as any).OS = "ios";
      await triggerScoreEntry();
      expect(Haptics.impactAsync).toHaveBeenCalled();
    });

    it("should work on Android", async () => {
      (Platform as any).OS = "android";
      await triggerScoreEntry();
      expect(Haptics.impactAsync).toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should not throw when haptics are unavailable", async () => {
      const error = new Error("Haptics unavailable");
      (Haptics.impactAsync as jest.Mock).mockRejectedValue(error);
      (Haptics.notificationAsync as jest.Mock).mockRejectedValue(error);

      await expect(triggerScoreEntry()).resolves.toBeUndefined();
      await expect(triggerPenalty()).resolves.toBeUndefined();
      await expect(triggerCompletion()).resolves.toBeUndefined();
      await expect(triggerError()).resolves.toBeUndefined();
    });

    it("should handle multiple consecutive errors", async () => {
      const error = new Error("Haptics unavailable");
      (Haptics.impactAsync as jest.Mock).mockRejectedValue(error);

      await triggerScoreEntry();
      await triggerScoreEntry();
      await triggerScoreEntry();

      // All should complete without throwing
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(3);
    });
  });

  describe("Performance requirements", () => {
    it("should complete all haptic triggers quickly", async () => {
      const functions = [
        triggerScoreEntry,
        triggerPenalty,
        triggerCompletion,
        triggerError,
      ];

      for (const fn of functions) {
        const startTime = Date.now();
        await fn();
        const endTime = Date.now();
        const duration = endTime - startTime;

        // All should complete within reasonable time (100ms buffer for test environment)
        // Actual runtime should be < 50ms on device
        expect(duration).toBeLessThan(100);
      }
    });
  });
});
