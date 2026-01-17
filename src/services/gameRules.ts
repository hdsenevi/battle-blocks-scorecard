/**
 * Game Rules Service
 * Pure functions for game rule enforcement logic
 * All functions are pure (no side effects, no React dependencies)
 */

/**
 * Check if score exceeds 50 (penalty rule)
 * @param score - Current player score
 * @returns true if score > 50, false otherwise
 */
export function checkPenaltyRule(score: number): boolean {
  return score > 50;
}

/**
 * Check if player should be eliminated (3+ consecutive misses)
 * @param consecutiveMisses - Number of consecutive misses
 * @returns true if consecutiveMisses >= 3, false otherwise
 */
export function checkElimination(consecutiveMisses: number): boolean {
  return consecutiveMisses >= 3;
}

/**
 * Check if player has won (exactly 50 points)
 * @param score - Current player score
 * @returns true if score === 50, false otherwise
 */
export function checkWinCondition(score: number): boolean {
  return score === 50;
}

/**
 * Calculate score based on blocks and entry mode
 * @param blocks - Array of block numbers
 * @param isMultiple - true for multiple blocks mode, false for single block mode
 * @returns Score value:
 *   - Single block mode: returns the first valid block number value
 *   - Multiple blocks mode: returns the count of valid blocks
 */
export function calculateScore(
  blocks: number[],
  isMultiple: boolean
): number {
  // Handle empty array
  if (blocks.length === 0) {
    return 0;
  }

  if (isMultiple) {
    // Multiple blocks mode: count valid blocks (0 is considered valid, Infinity is not)
    const validBlocks = blocks.filter(
      (block) =>
        typeof block === "number" &&
        !isNaN(block) &&
        block >= 0 &&
        isFinite(block)
    );
    return validBlocks.length;
  } else {
    // Single block mode: filter out invalid values (NaN, null, undefined, negative, 0, Infinity)
    // and return first valid non-zero finite value
    const validBlocks = blocks.filter(
      (block) =>
        typeof block === "number" &&
        !isNaN(block) &&
        block > 0 &&
        isFinite(block)
    );
    if (validBlocks.length === 0) {
      return 0;
    }
    return validBlocks[0];
  }
}
