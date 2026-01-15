/**
 * Game Rules Service Tests
 * Comprehensive unit tests for game rule enforcement functions
 * Target: 100% code coverage
 */

import {
  checkPenaltyRule,
  checkElimination,
  checkWinCondition,
  calculateScore,
} from "../gameRules";

describe("Game Rules Service", () => {
  // ============================================================================
  // checkPenaltyRule Tests
  // ============================================================================

  describe("checkPenaltyRule", () => {
    it("should return true when score exceeds 50", () => {
      expect(checkPenaltyRule(51)).toBe(true);
      expect(checkPenaltyRule(100)).toBe(true);
      expect(checkPenaltyRule(1000)).toBe(true);
    });

    it("should return false when score is exactly 50", () => {
      expect(checkPenaltyRule(50)).toBe(false);
    });

    it("should return false when score is below 50", () => {
      expect(checkPenaltyRule(49)).toBe(false);
      expect(checkPenaltyRule(25)).toBe(false);
      expect(checkPenaltyRule(0)).toBe(false);
    });

    it("should handle negative values", () => {
      expect(checkPenaltyRule(-1)).toBe(false);
      expect(checkPenaltyRule(-50)).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(checkPenaltyRule(50.1)).toBe(true);
      expect(checkPenaltyRule(50.0001)).toBe(true);
      expect(checkPenaltyRule(49.9999)).toBe(false);
    });
  });

  // ============================================================================
  // checkElimination Tests
  // ============================================================================

  describe("checkElimination", () => {
    it("should return true when consecutive misses is exactly 3", () => {
      expect(checkElimination(3)).toBe(true);
    });

    it("should return true when consecutive misses exceeds 3", () => {
      expect(checkElimination(4)).toBe(true);
      expect(checkElimination(5)).toBe(true);
      expect(checkElimination(10)).toBe(true);
    });

    it("should return false when consecutive misses is below 3", () => {
      expect(checkElimination(2)).toBe(false);
      expect(checkElimination(1)).toBe(false);
      expect(checkElimination(0)).toBe(false);
    });

    it("should handle negative values", () => {
      expect(checkElimination(-1)).toBe(false);
      expect(checkElimination(-10)).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(checkElimination(2.999)).toBe(false);
      expect(checkElimination(3.0)).toBe(true);
      expect(checkElimination(3.001)).toBe(true);
    });
  });

  // ============================================================================
  // checkWinCondition Tests
  // ============================================================================

  describe("checkWinCondition", () => {
    it("should return true when score is exactly 50", () => {
      expect(checkWinCondition(50)).toBe(true);
    });

    it("should return false when score is above 50", () => {
      expect(checkWinCondition(51)).toBe(false);
      expect(checkWinCondition(100)).toBe(false);
    });

    it("should return false when score is below 50", () => {
      expect(checkWinCondition(49)).toBe(false);
      expect(checkWinCondition(25)).toBe(false);
      expect(checkWinCondition(0)).toBe(false);
    });

    it("should handle negative values", () => {
      expect(checkWinCondition(-1)).toBe(false);
      expect(checkWinCondition(-50)).toBe(false);
    });

    it("should handle edge cases with floating point", () => {
      expect(checkWinCondition(50.0)).toBe(true);
      expect(checkWinCondition(50.0001)).toBe(false);
      expect(checkWinCondition(49.9999)).toBe(false);
    });
  });

  // ============================================================================
  // calculateScore Tests
  // ============================================================================

  describe("calculateScore", () => {
    describe("Single block mode (isMultiple = false)", () => {
      it("should return the block number value for single block", () => {
        expect(calculateScore([12], false)).toBe(12);
        expect(calculateScore([1], false)).toBe(1);
        expect(calculateScore([50], false)).toBe(50);
      });

      it("should return the first block value when multiple blocks provided but isMultiple is false", () => {
        expect(calculateScore([12, 15, 20], false)).toBe(12);
        expect(calculateScore([5, 10], false)).toBe(5);
      });

      it("should handle zero block value", () => {
        expect(calculateScore([0], false)).toBe(0);
      });

      it("should filter out negative values and return first valid block", () => {
        expect(calculateScore([-5, 10], false)).toBe(10);
        expect(calculateScore([-1, -2, 5], false)).toBe(5);
      });

      it("should return 0 for empty array", () => {
        expect(calculateScore([], false)).toBe(0);
      });

      it("should filter out NaN values", () => {
        expect(calculateScore([NaN, 10], false)).toBe(10);
        expect(calculateScore([NaN, NaN], false)).toBe(0);
      });

      it("should handle all invalid values", () => {
        expect(calculateScore([-1, -2, NaN], false)).toBe(0);
      });
    });

    describe("Multiple blocks mode (isMultiple = true)", () => {
      it("should return count of blocks for multiple blocks", () => {
        expect(calculateScore([12, 15, 20], true)).toBe(3);
        expect(calculateScore([5, 10], true)).toBe(2);
        expect(calculateScore([1, 2, 3, 4, 5], true)).toBe(5);
      });

      it("should return 1 for single block in multiple mode", () => {
        expect(calculateScore([12], true)).toBe(1);
        expect(calculateScore([50], true)).toBe(1);
      });

      it("should return 0 for empty array", () => {
        expect(calculateScore([], true)).toBe(0);
      });

      it("should filter out negative values and count only valid blocks", () => {
        expect(calculateScore([-5, 10, 15], true)).toBe(2);
        expect(calculateScore([-1, -2, 5, 10], true)).toBe(2);
        expect(calculateScore([-1, -2, -3], true)).toBe(0);
      });

      it("should filter out NaN values and count only valid blocks", () => {
        expect(calculateScore([NaN, 10, 15], true)).toBe(2);
        expect(calculateScore([NaN, NaN], true)).toBe(0);
      });

      it("should handle mixed invalid values", () => {
        expect(calculateScore([-1, NaN, 10, -5, 15], true)).toBe(2);
      });

      it("should handle zero block values (count them)", () => {
        expect(calculateScore([0, 0, 0], true)).toBe(3);
        expect(calculateScore([0, 10, 0], true)).toBe(3);
      });
    });

    describe("Edge cases and type safety", () => {
      it("should handle null/undefined as empty array (TypeScript should prevent this, but test defensive behavior)", () => {
        // TypeScript will prevent this, but we test the function's robustness
        // @ts-expect-error - Testing edge case
        expect(calculateScore(null, false)).toBe(0);
        // @ts-expect-error - Testing edge case
        expect(calculateScore(undefined, false)).toBe(0);
      });

      it("should handle very large arrays", () => {
        const largeArray = Array.from({ length: 1000 }, (_, i) => i);
        expect(calculateScore(largeArray, true)).toBe(1000);
        expect(calculateScore(largeArray, false)).toBe(0);
      });

      it("should handle very large block numbers", () => {
        expect(calculateScore([Number.MAX_SAFE_INTEGER], false)).toBe(
          Number.MAX_SAFE_INTEGER
        );
        expect(calculateScore([Number.MAX_SAFE_INTEGER], true)).toBe(1);
      });

      it("should handle floating point block numbers", () => {
        expect(calculateScore([12.5], false)).toBe(12.5);
        expect(calculateScore([12.5, 15.7], true)).toBe(2);
      });
    });
  });

  // ============================================================================
  // Function Purity Tests
  // ============================================================================

  describe("Function Purity", () => {
    it("checkPenaltyRule should be pure (same input = same output)", () => {
      expect(checkPenaltyRule(51)).toBe(checkPenaltyRule(51));
      expect(checkPenaltyRule(50)).toBe(checkPenaltyRule(50));
    });

    it("checkElimination should be pure (same input = same output)", () => {
      expect(checkElimination(3)).toBe(checkElimination(3));
      expect(checkElimination(2)).toBe(checkElimination(2));
    });

    it("checkWinCondition should be pure (same input = same output)", () => {
      expect(checkWinCondition(50)).toBe(checkWinCondition(50));
      expect(checkWinCondition(49)).toBe(checkWinCondition(49));
    });

    it("calculateScore should be pure (same input = same output)", () => {
      expect(calculateScore([12], false)).toBe(calculateScore([12], false));
      expect(calculateScore([12, 15], true)).toBe(
        calculateScore([12, 15], true)
      );
    });

    it("functions should not mutate input arrays", () => {
      const blocks = [12, 15, 20];
      const originalBlocks = [...blocks];
      calculateScore(blocks, true);
      expect(blocks).toEqual(originalBlocks);
    });
  });
});
