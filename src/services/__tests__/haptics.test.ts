/**
 * Tests for haptics service
 */

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import {
  triggerScoreEntry,
  triggerPenalty,
  triggerCompletion,
  triggerError,
} from "../haptics";

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native Platform
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    Platform: {
      OS: "ios",
    },
  };
});

// Mock __DEV__ global
global.__DEV__ = true;

describe("Haptics Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("triggerScoreEntry", () => {
    it("should trigger light impact haptic on iOS", async () => {
      (Platform as any).OS = "ios";
      await triggerScoreEntry();
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it("should trigger light impact haptic on Android", async () => {
      (Platform as any).OS = "android";
      await triggerScoreEntry();
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it("should not trigger haptic on web platform", async () => {
      (Platform as any).OS = "web";
      await triggerScoreEntry();
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      (Platform as any).OS = "ios";
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      (Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Haptic unavailable")
      );

      await triggerScoreEntry();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Haptic feedback unavailable for score entry:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it("should complete within reasonable time", async () => {
      (Platform as any).OS = "ios";
      const startTime = Date.now();
      await triggerScoreEntry();
      const duration = Date.now() - startTime;

      // In test environment, allow up to 100ms; on device should be < 50ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe("triggerPenalty", () => {
    it("should trigger medium impact haptic on iOS", async () => {
      (Platform as any).OS = "ios";
      await triggerPenalty();
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it("should trigger medium impact haptic on Android", async () => {
      (Platform as any).OS = "android";
      await triggerPenalty();
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it("should not trigger haptic on web platform", async () => {
      (Platform as any).OS = "web";
      await triggerPenalty();
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      (Platform as any).OS = "ios";
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      (Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Haptic unavailable")
      );

      await triggerPenalty();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Haptic feedback unavailable for penalty:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it("should complete within reasonable time", async () => {
      (Platform as any).OS = "ios";
      const startTime = Date.now();
      await triggerPenalty();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe("triggerCompletion", () => {
    it("should trigger success notification haptic on iOS", async () => {
      (Platform as any).OS = "ios";
      await triggerCompletion();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      );
    });

    it("should trigger success notification haptic on Android", async () => {
      (Platform as any).OS = "android";
      await triggerCompletion();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      );
    });

    it("should not trigger haptic on web platform", async () => {
      (Platform as any).OS = "web";
      await triggerCompletion();
      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      (Platform as any).OS = "ios";
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      (Haptics.notificationAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Haptic unavailable")
      );

      await triggerCompletion();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Haptic feedback unavailable for completion:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it("should complete within reasonable time", async () => {
      (Platform as any).OS = "ios";
      const startTime = Date.now();
      await triggerCompletion();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe("triggerError", () => {
    it("should trigger error notification haptic on iOS", async () => {
      (Platform as any).OS = "ios";
      await triggerError();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Error
      );
    });

    it("should trigger error notification haptic on Android", async () => {
      (Platform as any).OS = "android";
      await triggerError();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Error
      );
    });

    it("should not trigger haptic on web platform", async () => {
      (Platform as any).OS = "web";
      await triggerError();
      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      (Platform as any).OS = "ios";
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      (Haptics.notificationAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Haptic unavailable")
      );

      await triggerError();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Haptic feedback unavailable for error:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it("should complete within reasonable time", async () => {
      (Platform as any).OS = "ios";
      const startTime = Date.now();
      await triggerError();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe("Platform handling", () => {
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

    it("should gracefully skip on unsupported platforms", async () => {
      (Platform as any).OS = "web";
      await triggerScoreEntry();
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });
});
