/**
 * Tests for game rules service
 * 100% code coverage required for rule accuracy
 */

import {
  checkPenaltyRule,
  checkElimination,
  checkWinCondition,
  calculateScore,
} from "../gameRules";

describe("Game Rules Service", () => {
  describe("checkPenaltyRule", () => {
    it("should return false when score is less than 50", () => {
      expect(checkPenaltyRule(0)).toBe(false);
      expect(checkPenaltyRule(25)).toBe(false);
      expect(checkPenaltyRule(49)).toBe(false);
      expect(checkPenaltyRule(49.9)).toBe(false);
    });

    it("should return false when score is exactly 50", () => {
      expect(checkPenaltyRule(50)).toBe(false);
    });

    it("should return true when score exceeds 50", () => {
      expect(checkPenaltyRule(51)).toBe(true);
      expect(checkPenaltyRule(100)).toBe(true);
      expect(checkPenaltyRule(50.1)).toBe(true);
    });

    it("should handle negative values", () => {
      expect(checkPenaltyRule(-1)).toBe(false);
      expect(checkPenaltyRule(-50)).toBe(false);
    });

    it("should handle floating point values", () => {
      expect(checkPenaltyRule(50.0001)).toBe(true);
      expect(checkPenaltyRule(49.9999)).toBe(false);
    });
  });

  describe("checkElimination", () => {
    it("should return false when consecutive misses is less than 3", () => {
      expect(checkElimination(0)).toBe(false);
      expect(checkElimination(1)).toBe(false);
      expect(checkElimination(2)).toBe(false);
    });

    it("should return true when consecutive misses is exactly 3", () => {
      expect(checkElimination(3)).toBe(true);
    });

    it("should return true when consecutive misses exceeds 3", () => {
      expect(checkElimination(4)).toBe(true);
      expect(checkElimination(10)).toBe(true);
    });

    it("should handle negative values", () => {
      expect(checkElimination(-1)).toBe(false);
      expect(checkElimination(-10)).toBe(false);
    });

    it("should handle floating point values", () => {
      expect(checkElimination(2.9)).toBe(false);
      expect(checkElimination(3.0)).toBe(true);
      expect(checkElimination(3.1)).toBe(true);
    });
  });

  describe("checkWinCondition", () => {
    it("should return false when score is less than 50", () => {
      expect(checkWinCondition(0)).toBe(false);
      expect(checkWinCondition(25)).toBe(false);
      expect(checkWinCondition(49)).toBe(false);
      expect(checkWinCondition(49.9)).toBe(false);
    });

    it("should return true when score is exactly 50", () => {
      expect(checkWinCondition(50)).toBe(true);
    });

    it("should return false when score exceeds 50", () => {
      expect(checkWinCondition(51)).toBe(false);
      expect(checkWinCondition(100)).toBe(false);
      expect(checkWinCondition(50.1)).toBe(false);
    });

    it("should handle negative values", () => {
      expect(checkWinCondition(-1)).toBe(false);
      expect(checkWinCondition(-50)).toBe(false);
    });

    it("should handle floating point values", () => {
      expect(checkWinCondition(50.0)).toBe(true);
      expect(checkWinCondition(50.0001)).toBe(false);
      expect(checkWinCondition(49.9999)).toBe(false);
    });
  });

  describe("calculateScore", () => {
    describe("single block mode (isMultiple = false)", () => {
      it("should return the first block number value", () => {
        expect(calculateScore([5], false)).toBe(5);
        expect(calculateScore([10], false)).toBe(10);
        expect(calculateScore([1], false)).toBe(1);
      });

      it("should return the first block when multiple blocks provided", () => {
        expect(calculateScore([5, 10, 15], false)).toBe(5);
        expect(calculateScore([1, 2, 3], false)).toBe(1);
      });

      it("should return 0 for empty array", () => {
        expect(calculateScore([], false)).toBe(0);
      });

      it("should filter out negative values and return first valid", () => {
        expect(calculateScore([-1, 5], false)).toBe(5);
        expect(calculateScore([-5, -10, 3], false)).toBe(3);
      });

      it("should filter out zero and return first valid", () => {
        expect(calculateScore([0, 5], false)).toBe(5);
        expect(calculateScore([0, 0, 10], false)).toBe(10);
      });

      it("should return 0 when all blocks are invalid", () => {
        expect(calculateScore([-1, -5], false)).toBe(0);
        expect(calculateScore([0, 0], false)).toBe(0);
      });

      it("should handle zero as valid block value", () => {
        expect(calculateScore([0], false)).toBe(0);
      });
    });

    describe("multiple blocks mode (isMultiple = true)", () => {
      it("should return count of blocks", () => {
        expect(calculateScore([5], true)).toBe(1);
        expect(calculateScore([5, 10], true)).toBe(2);
        expect(calculateScore([1, 2, 3, 4, 5], true)).toBe(5);
      });

      it("should return 0 for empty array", () => {
        expect(calculateScore([], true)).toBe(0);
      });

      it("should count only valid blocks (filter out negative)", () => {
        expect(calculateScore([5, -1, 10], true)).toBe(2);
        expect(calculateScore([-5, -10, 3, 7], true)).toBe(2);
      });

      it("should count zero as valid block", () => {
        expect(calculateScore([0, 5, 10], true)).toBe(3);
        expect(calculateScore([0, 0, 0], true)).toBe(3);
      });

      it("should return 0 when all blocks are invalid", () => {
        expect(calculateScore([-1, -5], true)).toBe(0);
      });

      it("should handle single valid block", () => {
        expect(calculateScore([5], true)).toBe(1);
        expect(calculateScore([0], true)).toBe(1);
      });
    });

    describe("edge cases for both modes", () => {
      it("should handle NaN values", () => {
        expect(calculateScore([NaN, 5], false)).toBe(5);
        expect(calculateScore([NaN, 5], true)).toBe(1);
        expect(calculateScore([NaN], false)).toBe(0);
        expect(calculateScore([NaN], true)).toBe(0);
      });

      it("should handle Infinity values", () => {
        expect(calculateScore([Infinity, 5], false)).toBe(5);
        expect(calculateScore([Infinity, 5], true)).toBe(1);
        expect(calculateScore([-Infinity, 5], false)).toBe(5);
        expect(calculateScore([-Infinity, 5], true)).toBe(1);
      });

      it("should not mutate input array", () => {
        const blocks = [5, 10, 15];
        const originalBlocks = [...blocks];
        calculateScore(blocks, false);
        calculateScore(blocks, true);
        expect(blocks).toEqual(originalBlocks);
      });

      it("should handle very large arrays", () => {
        const largeArray = Array.from({ length: 100 }, (_, i) => i + 1);
        expect(calculateScore(largeArray, false)).toBe(1);
        expect(calculateScore(largeArray, true)).toBe(100);
      });

      it("should handle mixed valid and invalid values", () => {
        const mixed = [5, -1, 10, NaN, 0, -5, 15, Infinity];
        expect(calculateScore(mixed, false)).toBe(5);
        expect(calculateScore(mixed, true)).toBe(4); // 5, 10, 0, 15 (4 valid, Infinity excluded)
      });
    });
  });

  describe("function purity", () => {
    it("should not have side effects - checkPenaltyRule", () => {
      const score = 60;
      const result1 = checkPenaltyRule(score);
      const result2 = checkPenaltyRule(score);
      expect(result1).toBe(result2);
      expect(score).toBe(60); // Input unchanged
    });

    it("should not have side effects - checkElimination", () => {
      const misses = 3;
      const result1 = checkElimination(misses);
      const result2 = checkElimination(misses);
      expect(result1).toBe(result2);
      expect(misses).toBe(3); // Input unchanged
    });

    it("should not have side effects - checkWinCondition", () => {
      const score = 50;
      const result1 = checkWinCondition(score);
      const result2 = checkWinCondition(score);
      expect(result1).toBe(result2);
      expect(score).toBe(50); // Input unchanged
    });

    it("should not mutate input array - calculateScore", () => {
      const blocks = [5, 10, 15];
      const originalLength = blocks.length;
      calculateScore(blocks, true);
      expect(blocks.length).toBe(originalLength);
      expect(blocks).toEqual([5, 10, 15]);
    });
  });
});
