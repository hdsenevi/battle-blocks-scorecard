/**
 * Tests for platform utilities
 */

import { Platform } from "react-native";
import {
  isIOS,
  isAndroid,
  isWeb,
  selectPlatform,
  getMinTouchTargetSize,
  getPlatformFont,
  isHapticsAvailable,
} from "../platform";

// Mock Platform
jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
    select: jest.fn((obj) => obj.ios || obj.default),
  },
}));

describe("platform utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("isIOS", () => {
    it("should return true when Platform.OS is ios", () => {
      (Platform.OS as any) = "ios";
      expect(isIOS()).toBe(true);
    });

    it("should return false when Platform.OS is not ios", () => {
      (Platform.OS as any) = "android";
      expect(isIOS()).toBe(false);
    });
  });

  describe("isAndroid", () => {
    it("should return true when Platform.OS is android", () => {
      (Platform.OS as any) = "android";
      expect(isAndroid()).toBe(true);
    });

    it("should return false when Platform.OS is not android", () => {
      (Platform.OS as any) = "ios";
      expect(isAndroid()).toBe(false);
    });
  });

  describe("isWeb", () => {
    it("should return true when Platform.OS is web", () => {
      (Platform.OS as any) = "web";
      expect(isWeb()).toBe(true);
    });

    it("should return false when Platform.OS is not web", () => {
      (Platform.OS as any) = "ios";
      expect(isWeb()).toBe(false);
    });
  });

  describe("selectPlatform", () => {
    it("should select iOS value when on iOS", () => {
      (Platform.select as jest.Mock).mockReturnValue("ios-value");
      selectPlatform({
        ios: "ios-value",
        android: "android-value",
        default: "default-value",
      });
      expect(Platform.select).toHaveBeenCalledWith({
        ios: "ios-value",
        android: "android-value",
        default: "default-value",
      });
    });
  });

  describe("getMinTouchTargetSize", () => {
    it("should return 44 for iOS", () => {
      (Platform.select as jest.Mock).mockReturnValue(44);
      (Platform.OS as any) = "ios";
      expect(getMinTouchTargetSize()).toBe(44);
      expect(Platform.select).toHaveBeenCalledWith({
        ios: 44,
        android: 48,
        default: 44,
      });
    });

    it("should return 48 for Android", () => {
      (Platform.select as jest.Mock).mockReturnValue(48);
      (Platform.OS as any) = "android";
      expect(getMinTouchTargetSize()).toBe(48);
      expect(Platform.select).toHaveBeenCalledWith({
        ios: 44,
        android: 48,
        default: 44,
      });
    });
  });

  describe("getPlatformFont", () => {
    it("should return System for iOS", () => {
      (Platform.select as jest.Mock).mockReturnValue("System");
      (Platform.OS as any) = "ios";
      expect(getPlatformFont()).toBe("System");
      expect(Platform.select).toHaveBeenCalledWith({
        ios: "System",
        android: "Roboto",
        default: "System",
      });
    });

    it("should return Roboto for Android", () => {
      (Platform.select as jest.Mock).mockReturnValue("Roboto");
      (Platform.OS as any) = "android";
      expect(getPlatformFont()).toBe("Roboto");
      expect(Platform.select).toHaveBeenCalledWith({
        ios: "System",
        android: "Roboto",
        default: "System",
      });
    });
  });

  describe("isHapticsAvailable", () => {
    it("should return true for iOS", () => {
      (Platform.OS as any) = "ios";
      expect(isHapticsAvailable()).toBe(true);
    });

    it("should return true for Android", () => {
      (Platform.OS as any) = "android";
      expect(isHapticsAvailable()).toBe(true);
    });

    it("should return false for web", () => {
      (Platform.OS as any) = "web";
      expect(isHapticsAvailable()).toBe(false);
    });
  });
});
